exports.LEAVE_AS_SOON_AS_SHUTTLE = "가까운 시간의 달구지를 알려줘"
exports.ALL_SHUTTLE_TIME = "전체 달구지 시간표를 알려줘"
exports.SHUTTLE_STATION = "달구지 운행노선을 알려줘"
exports.SERVICE_INFO = "서비스 정보"
exports.GIHEUNG_TO_SCHOOL = "기흥역에서 이공관으로 갈꺼야"
exports.KANGNAM_UNIV_STATION_TO_SCHOOL = "강남대역에서 이공관으로 갈꺼야"
exports.SCHOOL_TO_GIHEUNG = "이공관에서 기흥역으로 갈꺼야"
exports.SCHOOL_TO_KANGNAM_UNIV_STATION = "이공관에서 강남대역으로 갈꺼야"
exports.ACADEMIC_CALENDAR = "이번달 학사 일정을 알려줘"
exports.DICE_NUMBER_START = "주사위 굴리기 가즈아~!!"
exports.MAIN_BUTTONS = [
    exports.LEAVE_AS_SOON_AS_SHUTTLE,
    exports.ALL_SHUTTLE_TIME,
    exports.SHUTTLE_STATION,
    exports.ACADEMIC_CALENDAR,
    exports.DICE_NUMBER_START,
    exports.SERVICE_INFO]
exports.ERROR_MSG = "오 이런! 어딘가 문제가 발생한것 같군요!"

exports.ASK_SEARCH_TARGET_MONTH = "조회하려는 달을 선택해주세요!"
exports.MONTH_STR = "월"
exports.YEAR_SCHEDULE = [
    "1" + exports.MONTH_STR,
    "2" + exports.MONTH_STR,
    "3" + exports.MONTH_STR,
    "4" + exports.MONTH_STR,
    "5" + exports.MONTH_STR,
    "6" + exports.MONTH_STR,
    "7" + exports.MONTH_STR,
    "8" + exports.MONTH_STR,
    "9" + exports.MONTH_STR,
    "10" + exports.MONTH_STR,
    "11" + exports.MONTH_STR,
    "12" + exports.MONTH_STR
]
exports.SHUTTLE_START_POINT_BUTTONS = [
    exports.GIHEUNG_TO_SCHOOL,
    exports.KANGNAM_UNIV_STATION_TO_SCHOOL,
    exports.SCHOOL_TO_GIHEUNG,
    exports.SCHOOL_TO_KANGNAM_UNIV_STATION]
exports.DATABASE_GIHEUNG_TO_SCHOOL = "GiheungToSchool"
exports.DATABASE_KANGNAM_UNIV_TO_SCHOOL = "KangnamUnivToSchool"
exports.DATABASE_SCHOOL_TO_GIHEUNG = "SchoolToGiheung"
exports.DATABASE_SCHOOL_TO_KANGNAM_UNIV = "SchoolToKangnamUniv"
exports.DATABASE_ADVERTISE = "Advertise"
exports.STORAGE_SHARE_CARD_URL = "https://firebasestorage.googleapis.com/v0/b/kangnamshuttle.appspot.com/o/poster.png?alt=media&token=fb60f794-50a2-40c8-be0c-f2400eabaad4"
exports.KAKAO_PLUS_SHARE_URL = "https://pf.kakao.com/_wkxjxoxl"
exports.GO_TO_HOMEPAGE = "https://kangnamshuttle.firebaseapp.com/"
exports.SHUTTLE_SCHEDULE_PHOTO = "https://firebasestorage.googleapis.com/v0/b/kangnamshuttle.appspot.com/o/KakaoTalk_Photo_2018-02-28-17-02-56.jpeg?alt=media&token=9dfc1e0e-b50f-4cbf-9914-5bc78fcf4476"
exports.PLZ_INPUT_DEPART_AND_ARRIVE_POINT = "출발 지점과 도착지점을 알려주세요!"
exports.LET_ME_SHOW_ALL_OF_BUS_TIME = "전체 시간표를 알려드릴께요~"
exports.TEXT_GIHEUNG_TO_SCHOOL = "====기흥역 -> 이공관====\n"
exports.TEXT_KANGNAM_UNIV_TO_SCHOOL = "====강남대역 -> 이공관====\n"
exports.TEXT_SCHOOL_TO_GIHEUNG = "====이공관 -> 기흥역====\n"
exports.TEXT_SCHOOL_TO_KANGNAM_UNIV = "====이공관 -> 강남대역====\n"
exports.SHUTTLE_STATION_ROUTE = "달구지 운행정보 알려드릴께요~\n이공관 -> 본관(교육관) -> 인문사회관 -> 맥도날드앞 -> 기흥역 -> 강남대역 -> 샬롬관 -> 본관(교육관)-> 이공관"

exports.LOG_LEVEL_VERBOSE = 0
exports.LOG_LEVEL_INFO = 1
exports.LOG_LEVEL_DEBUG = 2
exports.LOG_LEVEL_WARN = 3
exports.LOG_LEVEL_ERROR = 4

exports.DAY_TO_HOUR = 24
exports.GMT_KOREA_TIME = 9
exports.GMT_KOREA_TIME_MIN = 540
exports.HOUR_TO_MILE = 60000

exports.DATABASE_SCHOOL_SCHEDULE = "/Schedule/"
exports.DATABASE_WEATHER = "Weather"

exports.SYSTEM_INFO_STR = "버전: %s\n최종 수정일: %s\n개발자: %s\n메일: %s"

exports.BUS_FIRST_TIME_STR = "첫 차가 %s에 있어요!\n다음 버스는 %s에 있어요."
exports.BUS_LAST_TIME_STR = "마지막 차가 %s에 있어요!"
exports.BUS_END_STR = "풉! 차를 다 놓치셨군요!\n첫 차는 %s에 있어요."
exports.BUS_NORMAL_TIME_STR = "이번 차는 %s에 있어요!\n다음 버스는 %s에 있어요."

exports.DICE_NUMBER_RESULT_STR = "%s 가즈아~!!"

exports.SCHEDULE_RESULT_STR = "%s월달의 일정을 알려줄께요!\n"

exports.WEATHER_CAST_STR = "현제 경기도의 날씨는 %s 이며 온도는 섭씨 %s도 이군요"

exports.SAY_AGAIN = "다시 말해주세요!"

exports.ORDER_TO_ID = {}
exports.ORDER_TO_ID[exports.SAY_AGAIN] = 0
exports.ORDER_TO_ID[exports.LEAVE_AS_SOON_AS_SHUTTLE] = 1
exports.ORDER_TO_ID[exports.ALL_SHUTTLE_TIME] = 2
exports.ORDER_TO_ID[exports.SHUTTLE_STATION] = 3
exports.ORDER_TO_ID[exports.SERVICE_INFO] = 4
exports.ORDER_TO_ID[exports.GIHEUNG_TO_SCHOOL] = 5
exports.ORDER_TO_ID[exports.KANGNAM_UNIV_STATION_TO_SCHOOL] = 6
exports.ORDER_TO_ID[exports.SCHOOL_TO_GIHEUNG] = 7
exports.ORDER_TO_ID[exports.SCHOOL_TO_KANGNAM_UNIV_STATION] = 8
exports.ORDER_TO_ID[exports.DICE_NUMBER_START] = 9
exports.ORDER_TO_ID[exports.ACADEMIC_CALENDAR] = 10
exports.ORDER_TO_ID[exports.ASK_SEARCH_TARGET_MONTH] = 10
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[0]] = 11
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[1]] = 12
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[2]] = 13
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[3]] = 14
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[4]] = 15
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[5]] = 16
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[6]] = 17
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[7]] = 18
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[8]] = 19
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[9]] = 20
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[10]] = 21
exports.ORDER_TO_ID[exports.YEAR_SCHEDULE[11]] = 22

exports.NOT_AVAILABLE = -1

exports.ZERO = 0

exports.ENABLE = 1
exports.DISABLE = 0

exports.DEBUG_MOD = 0