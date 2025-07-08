from tabulate import tabulate
import pymysql
import os
import textwrap
def shorten_text(text, width=20):
    if isinstance(text, str):
        return '\n'.join(textwrap.wrap(text, width=width))
    return text
conn = pymysql.connect(host="127.0.0.1", user="root", password="1234", db="university_df", charset="utf8")
page_sizes = 10 # 페이지당 보여주는 데이터 개수
tables = [
    "main_info", "researcher", "paper", "professor_subject",
    "project", "recruit", "research_topic", "professor"
]
def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')
def print_main_menu():
    clear_screen()
    print("\n## 연구실 정보 DB 관리 시스템 ##")
    print("(1) Raw 데이터 조회")
    print("(2) 데이터 분석")
    print("(3) 종료\n")

def print_table_menu():
    clear_screen()
    print("\n[테이블 목록]")
    for i, tbl in enumerate(tables, 1):
        print(f"({i}) {tbl}")
    print(f"({len(tables)+1}) 뒤로가기\n")

def print_crud_menu(selected_table):
    clear_screen()
    print(f"\n## [{selected_table}] 테이블 관리 ##")
    print("(1) 전체 조회")
    print("(2) 뒤로가기\n")

def select_all(table):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {table}")
    rows = cur.fetchall()

    if not rows:
        print(">> 데이터가 없습니다.")
        return

    cur.execute(f"SHOW COLUMNS FROM {table}")
    headers = [col[0] for col in cur.fetchall()]

    page_size = page_sizes
    total_pages = (len(rows) - 1) // page_size + 1
    current_page = 0

    while True:
        start = current_page * page_size
        end = start + page_size
        page_rows = rows[start:end]
        clear_screen()
        print(f"\n[전체 데이터 조회] - {table} (페이지 {current_page + 1} / {total_pages})")
        print(tabulate(page_rows, headers=headers, tablefmt="grid"))

        if total_pages == 1:
            break

        command = input("\n[n] 다음페이지 | [p] 이전페이지 | [q] 종료: ").lower()

        if command == "n":
            if current_page < total_pages - 1:
                current_page += 1
            else:
                print(">> 마지막 페이지입니다.")
        elif command == "p":
            if current_page > 0:
                current_page -= 1
            else:
                print(">> 첫 페이지입니다.")
        elif command == "q":
            break
        else:
            print(">> 잘못된 명령입니다.")

def analyze_all_columns():
    cur = conn.cursor()
    clear_screen()
    print("\n[전체 열 및 데이터 개수 분석]")
    result = []
    for table in tables:
        cur.execute(f"SHOW COLUMNS FROM {table}")
        columns = [col[0] for col in cur.fetchall()]
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        count = cur.fetchone()[0]
        result.append([table, ", ".join(columns), count])
    print(tabulate(result, headers=["테이블명", "열 목록", "데이터 개수"], tablefmt="fancy_grid"))
    input("\n[엔터] 키를 눌러 계속...")

def analyze_professors():
    cur = conn.cursor()
    clear_screen()
    print("\n[교수별 정보 요약]")
    sql = """
    SELECT p.main_url, p.category, p.name, p.email, p.university, p.phone, p.office_location,
           COALESCE(ps.subjects, '정보없음')
    FROM professor p
    LEFT JOIN professor_subject ps ON p.main_url = ps.main_url AND p.category = ps.category
    ORDER BY p.main_url, p.category
    """
    cur.execute(sql)
    rows = cur.fetchall()
    headers = ["main_url", "category", "name", "email", "university", "phone", "office_location", "subjects"]
    page_size = page_sizes
    current_page = 0
    filtered = rows

    def print_page():
        total_pages = (len(filtered)-1)//page_size + 1
        clear_screen()
        print(f"\n[교수 정보] (페이지 {current_page+1}/{total_pages})")
        print(tabulate(filtered[current_page*page_size:(current_page+1)*page_size], headers=headers, tablefmt="grid"))

    while True:
        clear_screen()
        print_page()
        command = input("\n[n] 다음 | [p] 이전 | [f] 필터 | [q] 종료: ").lower()
        if command == "n":
            if (current_page + 1) * page_size < len(filtered): current_page += 1
            else: print(">> 마지막 페이지입니다.")
        elif command == "p":
            if current_page > 0: current_page -= 1
            else: print(">> 첫 페이지입니다.")
        elif command == "f":
            for i, h in enumerate(headers): print(f"({i+1}) {h}")
            col = int(input("열 선택: ")) - 1
            keyword = input("검색어: ")
            filtered = [r for r in rows if keyword.lower() in str(r[col]).lower()]
            current_page = 0
        elif command == "q": break

def show_lab_details(main_url):
    while True:
        clear_screen()
        print(f"\n[연구실 상세 보기] - {main_url}")
        print("(1) 연구원 정보")
        print("(2) 프로젝트")
        print("(3) 논문")
        print("(4) 뒤로가기")
        choice = input("선택 ==> ")
        if choice == "1": show_researchers(main_url)
        elif choice == "2": show_projects(main_url)
        elif choice == "3": show_papers(main_url)
        elif choice == "4": break


def analyze_research_labs():
    cur = conn.cursor()
    sql = """
    SELECT
    rt.main_url,
    COALESCE(p.name, '정보없음'),
    COALESCE(p.university, '정보없음'),
    GROUP_CONCAT(DISTINCT rt.topic SEPARATOR ', ') AS topics,
    COALESCE(r.info, '정보없음'),
    COALESCE(p.office_location, '정보없음')
    FROM research_topic rt
    LEFT JOIN (
        SELECT p1.*
        FROM professor p1
        INNER JOIN (
            SELECT main_url, MIN(id) AS min_id
            FROM professor
            GROUP BY main_url
        ) p2 ON p1.main_url = p2.main_url AND p1.id = p2.min_id
    ) p ON rt.main_url = p.main_url
    LEFT JOIN (
        SELECT r1.*
        FROM recruit r1
        INNER JOIN (
            SELECT main_url, MIN(id) AS min_id
            FROM recruit
            GROUP BY main_url
        ) r2 ON r1.main_url = r2.main_url AND r1.id = r2.min_id
    ) r ON rt.main_url = r.main_url
    GROUP BY rt.main_url, p.name, p.university, r.info, p.office_location
    ORDER BY rt.main_url
    """
    cur.execute(sql)
    rows = cur.fetchall()
    headers = ["main_url", "이름", "university", "연구주제", "모집정보", "office_location"]
    page_size = page_sizes
    current_page = 0
    filtered = rows
    '''
    def print_page():
        total_pages = (len(filtered)-1)//page_size + 1
        print(f"\n[연구실 정보] (페이지 {current_page+1}/{total_pages})")
        numbered = [(i+1,) + row for i, row in enumerate(filtered[current_page*page_size:(current_page+1)*page_size])]
        print(tabulate(numbered, headers=["번호"] + headers, tablefmt="grid"))
    '''
    def print_page():
        total_pages = (len(filtered) - 1) // page_size + 1
        print(f"\n[연구실 정보] (페이지 {current_page+1}/{total_pages})")
        
        page_data = filtered[current_page * page_size:(current_page + 1) * page_size]
        
        wrapped_data = [
            tuple(shorten_text(col) for col in row)
            for row in page_data
        ]
        
        numbered = [(i + 1,) + row for i, row in enumerate(wrapped_data)]
        
        print(tabulate(numbered, headers=["번호"] + headers, tablefmt="grid"))
    while True:
        clear_screen()
        print_page()
        command = input("\n[n] 다음 | [p] 이전 | [f] 필터 | [s] 연구실 선택 | [q] 종료: ").lower()
        if command == "n":
            if (current_page + 1) * page_size < len(filtered): current_page += 1
            else: print(">> 마지막 페이지입니다.")
        elif command == "p":
            if current_page > 0: current_page -= 1
            else: print(">> 첫 페이지입니다.")
        elif command == "f":
            for i, h in enumerate(headers): print(f"({i+1}) {h}")
            col = int(input("열 선택: ")) - 1
            keyword = input("검색어: ")
            filtered = [r for r in rows if keyword.lower() in str(r[col]).lower()]
            current_page = 0
        elif command == "s":
            idx = int(input("연구실 번호 선택: ")) - 1
            if 0 <= idx < len(filtered):
                selected = filtered[idx][0]  # main_url
                show_lab_details(selected)
            else:
                print(">> 잘못된 번호입니다.")
        elif command == "q": break


def show_researchers(main_url):
    cur = conn.cursor()
    cur.execute("""
        SELECT name, career_years, field, research_topic, etc FROM researcher WHERE main_url = %s
    """, (main_url,))
    rows = cur.fetchall()
    headers = ["name", "career_years", "field", "research_topic", "etc"]
    page_size = page_sizes
    current_page = 0
    filtered = rows

    def print_page():
        total = (len(filtered)-1)//page_size + 1
        print(f"\n[연구원 정보] (페이지 {current_page+1}/{total})")
        print(tabulate(filtered[current_page*page_size:(current_page+1)*page_size], headers=headers, tablefmt="grid"))

    while True:
        clear_screen()
        print_page()
        cmd = input("[n] 다음 | [p] 이전 | [f] 필터 | [q] 종료: ").lower()
        if cmd == "n":
            if (current_page + 1) * page_size < len(filtered): current_page += 1
            else: print(">> 마지막 페이지입니다.")
        elif cmd == "p":
            if current_page > 0: current_page -= 1
            else: print(">> 첫 페이지입니다.")
        elif cmd == "f":
            for i, h in enumerate(headers): print(f"({i+1}) {h}")
            col = int(input("열 선택: ")) - 1
            keyword = input("검색어: ")
            filtered = [r for r in rows if keyword.lower() in str(r[col]).lower()]
            current_page = 0
        elif cmd == "q": break

def show_projects(main_url):
    cur = conn.cursor()
    cur.execute("SELECT project_name, project_desc FROM project WHERE main_url = %s", (main_url,))
    rows = cur.fetchall()
    paginate_simple(rows, ["project_name", "project_desc"], "프로젝트", main_url)

def show_papers(main_url):
    cur = conn.cursor()
    cur.execute("SELECT paper_title, journal, author, year FROM paper WHERE main_url = %s", (main_url,))
    rows = cur.fetchall()
    paginate_simple(rows, ["paper_title", "journal", "author", "year"], "논문", main_url)

def paginate_simple(rows, headers, title, main_url):
    page_size = page_sizes
    current_page = 0
    def print_page():
        total = (len(rows)-1)//page_size + 1
        print(f"\n[{title}] - {main_url} (페이지 {current_page+1}/{total})")
        print(tabulate(rows[current_page*page_size:(current_page+1)*page_size], headers=headers, tablefmt="grid"))
    while True:
        clear_screen()
        print_page()
        cmd = input("[n] 다음 | [p] 이전 | [q] 종료: ").lower()
        if cmd == "n":
            if (current_page + 1) * page_size < len(rows): current_page += 1
            else: print(">> 마지막 페이지입니다.")
        elif cmd == "p":
            if current_page > 0: current_page -= 1
            else: print(">> 첫 페이지입니다.")
        elif cmd == "q": break

def show_analysis_menu():
    while True:
        clear_screen()
        print("\n## 데이터 분석 기능 ##")
        print("(1) 전체 열 분석 (테이블별 열 및 데이터 수)")
        print("(2) 교수님별 정보 요약")
        print("(3) 연구실별 내용 요약")
        print("(4) 뒤로가기\n")
        choice = input("선택하세요 ==> ")

        if choice == "1": analyze_all_columns()
        elif choice == "2": analyze_professors()
        elif choice == "3": analyze_research_labs()
        elif choice == "4": break

# === MAIN LOOP ===
while True:
    
    print_main_menu()
    menu = input("선택하세요 ==> ")
    if menu == "1":
        while True:
            print_table_menu()
            table_choice = input("테이블 선택 ==> ")
            if table_choice == str(len(tables)+1): break
            if not table_choice.isdigit() or int(table_choice) < 1 or int(table_choice) > len(tables):
                print(">> 올바른 번호를 입력해주세요.")
                continue
            selected_table = tables[int(table_choice)-1]
            while True:
                print_crud_menu(selected_table)
                crud = input("선택하세요 ==> ")
                if crud == "1": select_all(selected_table)
                elif crud == "2": break
                else: print(">> 잘못된 입력입니다.")
    elif menu == "2": show_analysis_menu()
    elif menu == "3": break
    else: print(">> 잘못된 입력입니다.")

conn.close()
print("프로그램 종료~")