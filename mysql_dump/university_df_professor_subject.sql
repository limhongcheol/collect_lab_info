-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: university_df
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `professor_subject`
--

DROP TABLE IF EXISTS `professor_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor_subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `main_url` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `subjects` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_subject`
--

LOCK TABLES `professor_subject` WRITE;
/*!40000 ALTER TABLE `professor_subject` DISABLE KEYS */;
INSERT INTO `professor_subject` VALUES (1,'http://eealab.cau.ac.kr/','lectures','\"종합설계\", \"전기기기 및 응용\", \"에너지변환공학\", \"아날로그 및 디지털회로 설계실습\", \"전자회로 설계실습\", \"회로및시스템\"'),(2,'https://cmlab.cau.ac.kr/cmlab','lectures','\"인공지능 영상 화질 개선 및 복원\", \"영상공학기초\", \"파이썬과 인공지능\", \"파이썬과 인공지능 실습\", \"인공지능 영상 화질 개선 및 복원 특강\", \"생성AI\", \"이산수학\", \"인공지능 창작프로젝트\", \"영상공학수학\"'),(3,'https://ctfd.pusan.ac.kr/ctfl/index..do','lectures','\"열역학\", \"열전달\", \"응용수학\", \"점성유동특론\", \"대류열전달특론\"'),(4,'https://ctfd.pusan.ac.kr/ctfl/index..do','lectures','\"열역학\", \"열전달\", \"응용수학\", \"점성유동특론\", \"대류열전달특론\"'),(5,'https://ctfd.pusan.ac.kr/ctfl/index..do','lectures','\"열역학\", \"열전달\", \"응용수학\", \"점성유동특론\", \"대류열전달특론\"'),(6,'https://ctfd.pusan.ac.kr/ctfl/index..do','lectures','\"열역학\", \"열전달\", \"응용수학\", \"점성유동특론\", \"대류열전달특론\"'),(7,'https://ctfd.pusan.ac.kr/ctfl/index..do','lectures','\"열역학\", \"열전달\", \"응용수학\", \"점성유동특론\", \"대류열전달특론\"'),(8,'https://hcail.snu.ac.kr/','lectures','\"인공지능 (AI)\", \"인간 중심 인공지능 (Human-Centered AI)\", \"의료 정보학 (Health Informatics)\", \"인간-컴퓨터 상호작용 (HCI)\", \"컴퓨터 지원 협업 (CSCW)\", \"도시 빅데이터 및 AI\"'),(9,'https://hcitech.org/','lectures','\"GCT 565 Augmented Humans\", \"CTP 445 Augmented Reality\", \"GCT 722 Interactive Haptic Technologies\", \"GCT/MV 623 Interaction Sensing Principle & Application\"'),(10,'http://infosec.pusan.ac.kr/','lectures','\"지능형 사물인터넷 보안 특론\", \"정보보안 기초\", \"Performing Vulnerability Assessment\", \"Advanced Active Directory Attack\"'),(11,'https://joonanlab.github.io/','lectures','\"유전학 (Genetics)\", \"생물정보학 기초 시리즈 (Introduction to Bioinformatics)\", \"바이오 인공지능 시리즈 (AI Biology)\", \"한국제약바이오협회 온라인 교육 - 인공지능을 활용한 전장유전체 유전변이분석\", \"약물 유전체 연구를 위한 유전변이 분석 기초 및 실습\", \"전장유전체 변이 분석의 이해\", \"Hail (전장유전체 데이터 분석 플랫폼) 기본개념 및 실무 모듈 연습\"'),(12,'https://modsim.gist.ac.kr/modsim/','lectures','\"Advanced CAD/CAM\", \"Engineering Analysis\"'),(13,'https://monet.knu.ac.kr/','lectures','\"컴퓨터망(Computer Networks)\", \"종합설계프로젝트2(Capstone Design Project2)\", \"종합설계프로젝트1(Capstone Design Project1)\", \"SW융합프로젝트1(SW Convergence Project1)\"'),(14,'https://medai.pusan.ac.kr/','lectures','\"융합교육\", \"전임교원 책임시수 개편 연구\", \"Programmatic Assessment\", \"전문직간 교육(IPE)\", \"전공 자율 선택제\"'),(15,'https://ctfd.pusan.ac.kr/ctfl/index..do','lectures','\"융합교육\", \"전임교원 책임시수 개편 연구\", \"학생성장을 위한 Programmatic Assessment\", \"전문직간 교육(IPE)\", \"전공 자율 선택제\"'),(16,'https://qi-lab.hanyang.ac.kr/','lectures','\"APS3015 품질 경영\", \"ASY6015 품질 데이터 애널리틱스\", \"ITC3013 해석가능인공지능\", \"ITC3009 텍스트마이닝\"'),(17,'https://sites.google.com/inha.ac.kr/orail','lectures','\"Management Science 1 (경영과학1)\", \"Management Science 2 (경영과학2)\", \"Advanced Machine Learning (고급기계학습)\", \"Supply Chain Management (공급사슬관리)\", \"Engineering Mathematics 1 (공업수학1)\", \"Industrial Engineering Applied Mathematics 1 (산업공학응용수학1)\", \"Production Control (생산통제)\", \"Seminar on Supply Chain Management (공급사슬관리 세미나)\"'),(18,'https://sites.google.com/kongju.ac.kr/ssplab','lectures','\"Chemical Reaction Engineering Ⅰ\", \"Chemical Process in Modern Society\", \"Future Chemical Process Design Technology\", \"Introduction to Chemical Engineering\", \"Advanced Mass Transfer\", \"Machine Learning and Separation Process\", \"Chemical Engineering Lab. Ⅲ\", \"Separation Processes Ⅰ\", \"Thermodynamics in Chemical Engineering\", \"Electric Vehicle Energy Storage System\"'),(19,'https://sites.google.com/site/namucf/','lectures','\"토질역학 및 실험\", \"지반공학 및 설계\", \"지반재해와지반공학\", \"사회기반시스템디자인\", \"지반동역학\", \"교통지반공학\", \"지반재해 및 지오센싱\", \"Civil Engineering Materials\"'),(20,'https://sites.google.com/view/biel2nd','lectures','\"Medical Physics\", \"Biomedical Optics\", \"Introduction to Biomedical Imaging\", \"Molecular Imaging\", \"Healthcare Artificial Intelligence\", \"Coding & AI\"'),(21,'https://sites.google.com/view/bkimlab','lectures','\"Introduction to Plasma Processes in Semiconductor Manufacturing\", \"Plasma Physics Fundamentals\", \"Simulation Methods for Plasma Processes\"'),(22,'https://sites.google.com/view/carlosmin','lectures','\"데이터 분석 개론\", \"Capstone 디자인 (산학협력 프로젝트)\"'),(23,'https://sites.google.com/view/eidl','lectures','\"PIERS 2025 (Photonics and Electromagnetics Research Symposium)\", \"LG Display Seminar\", \"Meta2025 (15th International Conference on Metamaterials, Photonic Crystals and Plasmonics)\", \"Optics and Photonics Congress 2025\", \"LG Display \"\"Display Insight Square\"\"\", \"Optical Science & Opto-Semiconductor Workshop (OSK)\", \"LG Innotech consulting seminar\", \"Corning Korea seminar\", \"17th Annual Meeting Photonic Devices\", \"KIEES, 2025 Microwave and Millimeter Wave Workshop\", \"CES 2025 Business Review & Insights\", \"LighTal\"'),(24,'https://sites.google.com/view/ei-k/dynamics-and-control-lab/research','lectures','\"재료역학\", \"데이터과학기초\", \"수송기기구조역학\", \"논문연구\", \"컴퓨터과학과 코딩\", \"다자유도계 시스템\", \"스마트소재및구조\", \"논문연구\", \"논문연구\"'),(25,'https://sites.google.com/view/ei-k/dynamics-and-control-lab/research','lectures','\"동역학\", \"제어\"'),(26,'https://sites.google.com/view/fnailab','lectures','\"Text Mining (텍스트마이닝)\", \"Natural Language Processing (자연어처리)\", \"Capstone Design (캡스톤디자인)\", \"Data Science Problem Solving and Practice (데이터문제해결및실습1)\", \"Data Structure and Practice (자료구조 및 실습)\", \"Sepcial Discussion on Data Science (데이터사이언스특론)\"'),(27,'https://sites.google.com/view/fnailab','lectures','\"RecSys\", \"IJCAI\", \"WWW\", \"EMNLP\", \"AAAI\"'),(28,'https://sites.google.com/view/hcc-lab','lectures','\"Human-AI Interaction\", \"Data Visualization\", \"Probability and Statistics\", \"Human and Computers\", \"Introduction to Industrial Project\", \"Introduction to Data Mining\", \"Database\", \"C Programming\"'),(29,'https://sites.google.com/view/heart-lab/','lectures','\"Human Emotion Applied, Recognized, and Transformed\"'),(30,'https://sites.google.com/view/junggroupkist/home','lectures','\"분자빔 에피택시 (Molecular Beam Epitaxy, MBE)\", \"양자점 (Quantum Dots)\", \"실리콘 기반 광전자 소자 (Silicon-based Optoelectronic Devices)\", \"광학 MEMS 및 나노광학 (Optical MEMS and Nanophotonics)\"'),(31,'https://sites.google.com/view/neuroailab/home','lectures','\"기초전자회로실험1\", \"디지털신호처리\", \"KW-VIP\", \"신경공학\"'),(32,'https://sites.google.com/view/scai-lab/','lectures','\"Speech Signal Processing\", \"Algorithm\", \"Pattern Recognition\", \"Programming\", \"Algorithm\", \"Basic Programming\"'),(33,'https://sites.google.com/view/sdclseoultech','lectures','\"Electronic Circuits I\", \"Capstone Design\", \"Memory Device Technology\", \"Semiconductor Devices\", \"Electric Circuit Analysis II\", \"Creative Engineering Design\", \"Electric Circuit Analysis I\"'),(34,'https://sites.google.com/view/snuh-bmi-lab','lectures','\"Lab Seminar (Bioinformatics)\", \"Medical Big Data\", \"Medical AI\", \"Natural Language Processing (NLP)\"'),(35,'https://sites.google.com/view/tailab?form=MY01SV&OCID=MY01SV','lectures','\"의료인공지능개론\", \"의료인공지능 응용 및 심화\"'),(36,'https://vslab.khu.ac.kr/','lectures','\"AI and Game Programming\", \"Web Python Programming\", \"Design Thinking\", \"Convergence Research 3\", \"Capstone Design (Data Analysis, SC)\", \"Numerical Analysis Programming\", \"Convergence Research 4\", \"Capstone Design (Robot and Vision, Data Analysis, SC)\", \"Visual Science Laboratory\", \"Convergence Research 3\", \"Capstone Design (Robot and Vision, Data Analysis, SC)\"'),(37,'https://www.teedlab.com/','lectures','\"강화학습 기반 스마트팩토리 운영방법\", \"자료구조\", \"최적화 개론\", \"선형대수 및 프로그래밍\", \"고급 C언어\"'),(38,'https://www.ust.ac.kr/prog/major/kor/sub43_04/AB/view.do;jsessionid=88B13B77AB2FCD910F4FBC22811F1394?majorNo=8','lectures','\"한국어 교육 프로그램\", \"영어 역량 강화 프로그램\", \"이러닝\", \"Eductech\", \"Flipped Learning\", \"강의 영상 제작\", \"상호작용 증진 도구\", \"MOOC\", \"이공계 기초 강좌\", \"공인 어학 강좌\", \"SERI&U\"');
/*!40000 ALTER TABLE `professor_subject` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-22 17:52:32
