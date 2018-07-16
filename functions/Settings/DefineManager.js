exports.LEAVE_AS_SOON_AS_SHUTTLE = "가까운 시간의 달구지를 알려줘"
exports.SHOW_ME_WHERE_IS_THE_SHUTTLE = "지금 달구지 어디있어?"
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
    exports.SHOW_ME_WHERE_IS_THE_SHUTTLE,
    exports.ALL_SHUTTLE_TIME,
    exports.SHUTTLE_STATION,
    exports.ACADEMIC_CALENDAR,
    exports.DICE_NUMBER_START,
    exports.SERVICE_INFO]
exports.ERROR_MSG = "어우, 저기...미안해요"

exports.ASK_SEARCH_TARGET_MONTH = "조회하고 싶은 달을 선택해주세요!"
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
exports.GO_TO_SHUTTLE_PAGE = "https://kangnamshuttle.firebaseapp.com/map.html"
exports.SHUTTLE_SCHEDULE_PHOTO = "https://firebasestorage.googleapis.com/v0/b/kangnamshuttle.appspot.com/o/IMG_0496.JPG?alt=media&token=8ef827c4-f566-49f1-8cf7-f7d2b667a3a2"
exports.PLZ_INPUT_DEPART_AND_ARRIVE_POINT = "어디로 모험을 떠나볼까요?"
exports.LET_ME_SHOW_ALL_OF_BUS_TIME = "어? 전체 시간표가 여기 있네요~"
exports.TEXT_GIHEUNG_TO_SCHOOL = "====기흥역 -> 이공관====\n"
exports.TEXT_KANGNAM_UNIV_TO_SCHOOL = "====강남대역 -> 이공관====\n"
exports.TEXT_SCHOOL_TO_GIHEUNG = "====이공관 -> 기흥역====\n"
exports.TEXT_SCHOOL_TO_KANGNAM_UNIV = "====이공관 -> 강남대역====\n"
exports.SHUTTLE_STATION_ROUTE = "다들 비키세요! 달구지 운행정보를 알려드릴께요!\n%s"
exports.SHOW_SHUTTLE_LOCATION = "달구지 위치는 지킬 가치가 있어요!"
exports.GO_TO_SHUTTLE_PAGE_LABEL = "확인하기"
exports.ALL_SHUTTLE_TIME_LABEL = "자세히"
exports.GO_TO_HOMEPAGE_LABEL = "홈페이지"

exports.LOG_LEVEL_VERBOSE = 0
exports.LOG_LEVEL_INFO = 1
exports.LOG_LEVEL_DEBUG = 2
exports.LOG_LEVEL_WARN = 3
exports.LOG_LEVEL_ERROR = 4

exports.DAY_TO_HOUR = 24
exports.GMT_KOREA_TIME = 9
exports.GMT_KOREA_TIME_MIN = 540
exports.HOUR_TO_MILE = 60000

exports.DATABASE_SCHOOL_SCHEDULE = "/service/SchoolSchedule/"
exports.DATABASE_UBIKAN_BUS_TRACKING_DATA = "/service/UbikanBus/"
exports.DATABASE_WEATHER = "/service/Weather/"
exports.DATABASE_SERVICE = "/service/"

exports.SYSTEM_INFO_STR = "버전: %s\n최종 수정일: %s\n개발자: %s\n메일: %s"

exports.BUS_FIRST_TIME_STR = "첫 차가 %s에 나타나요!\n다음 버스는 %s에 있으니 준비하세요."
exports.BUS_LAST_TIME_STR = "달구지는 아직 끝나지 않았어요, 마지막 차가 %s에 있어요!"
exports.BUS_END_STR = "풉! 차를 다 놓치셨군요!\n그러니까 평소에 잘 하란 말이에요\n첫 차는 %s에 있어요."
exports.BUS_NORMAL_TIME_STR = "이번 차는 %s에 있어요!\n다음 버스는 %s에 있어요. 알았죠?"

exports.DICE_NUMBER_RESULT_STR = "%s !! 어후, 더 잘할 수 있었는데!"

exports.SCHEDULE_RESULT_STR = "똑똑? %s월달 일정이 왔어요!\n"

exports.WEATHER_CAST_STR = "현재 경기도의 날씨는 %s 이며 기온은 섭씨 %s도 이군요!"
exports.WEATHER_CAST_WITH_NOTICE_STR = "현재 경기도의 날씨는 %s 이며 기온은 섭씨 %s도 이군요!\n날씨가 많이 더워요, 계단 안쪽으로 줄서주세요!"

exports.SAY_AGAIN = "다시 말해주세요!"

exports.TODAY_IS_MONDAY = "월요일이에요! >.<"
exports.CALCULATED_MONDAY_PERCENT_STR = "월요일이 되기까지 %s% 지나왔어요!"

exports.PASSED_BUS = "\n버스가 %s초 전에 출발해버렸네요ㅋㅋ 개인적인 감정은 없어요"

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
exports.ORDER_TO_ID[exports.SHOW_ME_WHERE_IS_THE_SHUTTLE] = 23

exports.NOT_AVAILABLE = -1

exports.ZERO = 0

exports.ENABLE = 1
exports.DISABLE = 0

exports.DEBUG_MOD = 0

exports.HTTP_REQUEST_SUCCESS = 200

exports.MSG_ALREADY_RESERVATED = "이미 광고가 존재합니다."
exports.MSG_SUCCESSFULLY_RESERVATED = "성공적으로 예약이 완료되었습니다. 관리자가 확인 후 승인을 할 예정입니다."

exports.MESSAGE_SUCCESS = "ok"
exports.MESSAGE_FAILED = "failed"

exports.HTTP_SUCCESS = 200
exports.HTTP_UNAUTHORIZED = 401
exports.HTTP_SERVER_ERROR = 500

exports.LINE_RESPONSE_TEMPLATE_TEXT = 1
exports.LINE_RESPONSE_TEMPLATE_MULTI_TEXT = 2
exports.LINE_RESPONSE_TEMPLATE_IMAGE = 3
exports.LINE_RESPONSE_TEMPLATE_VIDEO = 4
exports.LINE_RESPONSE_TEMPLATE_AUDIO = 5
exports.LINE_RESPONSE_TEMPLATE_LOCATION = 6
exports.LINE_RESPONSE_TEMPLATE_STICKER = 7
exports.LINE_RESPONSE_TEMPLATE_IMAGE_MAP = 8
exports.LINE_RESPONSE_TEMPLATE_BUTTONS = 9
exports.LINE_RESPONSE_TEMPLATE_CONFIRM = 10
exports.LINE_RESPONSE_TEMPLATE_CAROUSEL = 11

exports.LINE_RESPONSE_MAIN_CAROUSEL = 12
exports.LINE_RESPONSE_RUTE_CAROUSEL = 13

exports.LINE_RESPONSE_INTRODUCE = 14

exports.HOT_WEATHER_CELSIUS_THRESHOLD = 25
exports.WEATHER_CODE_CLEAR_SKY = 800
exports.WEATHER_CODE_FEW_CLOUDS = 801

// VERSION 2

exports.DATABASE_SERVICE_V2_0_0_RULE_INFO_ROUTINE_LINKED_LIST_PATH = "/V2/Service/V2_0_0/StaticContent/RuleInfo/RoutineLinkedList"
exports.DATABASE_INPUT_ORDER_LIST_SHORT_PATH = "inputOrderList"
exports.DATABASE_USERS_PATH = "/V2/Users"
exports.DATABASE_USER_LAST_ORDER_SHORT_PATH = "/lastOrder"
exports.DATABASE_SERVICE_V2_0_0_BUS_INFO_SCHEDULE_LIST_PATH = "/V2/Service/V2_0_0/StaticContent/BusInfo/ScheduleList"
exports.DATABASE_SERVICE_V2_0_0_SYSTEM_INFO_PATH = "/V2/Service/V2_0_0/StaticContent/SystemInfo"
exports.DATABASE_SERVICE_V2_0_0_RELEASE_NOTE_PATH = "/V2/Service/V2_0_0/StaticContent/ReleaseNote"
exports.DATABASE_SERVICE_BUS_INFO_ROUTINE_PATH = "/V2/Service/V2_0_0/StaticContent/BusInfo/Routine"
exports.DATABASE_SERVICE_V2_0_0_BUS_LOCATION_PATH = "/V2/Service/V2_0_0/StaticContent/BusInfo/LocationDic"
exports.DATABASE_SERVICE_V2_0_0_BUS_LOCATION_PAGE_PATH = "/V2/Service/V2_0_0/StaticContent/BusInfo/busLocationUrl"
exports.DATABASE_SERVICE_V2_0_0_SUBWAY_PLATFORM_INFO_PATH = "/V2/Service/V2_0_0/StaticContent/SubwayInfo/%s/%s"
exports.DATABASE_SERVICE_V2_0_0_WEATHER_INFO_PATH = "/V2/Service/V2_0_0/StaticContent/WeatherInfo"
exports.DATABASE_SERVICE_V2_0_0_USER_LAST_USER_DATE_TIME_PATH = "/V2/Users/%s/updatedDateTime"
exports.DATABASE_SERVICE_V2_0_0_USER_UID_PATH = "/V2/Users/%s/uid"

exports.AUTOMATON_START_NUMBER = 1
exports.AUTOMATON_DEFAULT_INPUT_NUMBER = 0
exports.AUTOMATON_MAIN_ORDER_NUMBER = 2
exports.AUTOMATON_BUS_SEARCH_ORDER_START_NUMBER = 100
exports.AUTOMATON_BUS_SEARCH_ORDER_END_NUMBER = 199
exports.AUTOMATON_PRINT_ALL_SHUTTLE_SCHEDULE_ORDER_NUMBER = 7
exports.AUTOMATON_SERVICE_INFO_ORDER_NUMBER = 9
exports.AUTOMATON_SERVICE_RELEASE_NOTE_ORDER_NUMBER = 10
exports.AUTOMATON_BUS_STATION_PRINT_ORDER_NUMBER = 8
exports.AUTOMATON_BUS_LOCATION_INFO_ORDER_NUMBER = 6
exports.AUTOMATON_SUBWAY_PLATFORM_KANGNAM_UNIV_TO_GIHEUNG_ORDER_NUMBER = 23
exports.AUTOMATON_SUBWAY_PLATFORM_KANGNAM_UNIV_TO_EVERLAND_NUMBER = 22
exports.AUTOMATON_SUBWAY_PLATFORM_GIHEUNG_TO_SUWON_NUMBER = 26
exports.AUTOMATON_SUBWAY_PLATFORM_GIHEUNG_TO_WANGSIMNI_NUMBER = 25
exports.AUTOMATON_TODAY_WEATHER_CAST = 27
exports.AUTOMATON_WRONG_INPUT_TYPE_RECEIVED_NUMBER = "500"
exports.AUTOMATON_USER_WANT_CHANGE_OWN_SETTING_ORDER_NUMBER = 31
exports.AUTOMATON_USER_CHECK_PROFILE_ORDER_NUMBER = 33

exports.RESPONSE_TYPE_OF_STR = 0
exports.RESPONSE_DEFAULT_SELECTION = 0

exports.BUS_STATUS_FIRST = 0
exports.BUS_STATUS_LAST = 2
exports.BUS_STATUS_MISSED_ALL = 3
exports.BUS_STATUS_NORMAL = 1

exports.SUBWAY_DIRECTION_UP = "1"
exports.SUBWAY_DIRECTION_DOWN = "2"
exports.SUBWAY_NORMAL_DAY_OF_WEEK = "1"
exports.SUBWAY_SATURDAY_OF_WEEK = "2"
exports.SUBWAY_SUNDAY_OF_WEEK = "3"
exports.SUBWAY_OPEN_API_RESULT_OK = "INFO-000"

exports.DATE_TIME_SATURDAY = 6
exports.DATE_TIME_SUNDAY = 0

exports.PRINT_TIME_OR_LEFT_MIN_THRES_SEC = 600

exports.WEATHER_STATUS_CODE = "200"
exports.WEATHER_FAILED_STR = "지금은 날씨 정보를 가지고 올 수 없습니다.\n나중에 다시 시도해주세요"

exports.USER_UNREGEISTERED_KEY_SHOW_LIMIT = 6