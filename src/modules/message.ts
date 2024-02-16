const message = {
    // default error status messages
    BAD_REQUEST: '잘못된 요청입니다.',
    BAD_PATH: '잘못된 경로입니다.',
    UNAUTHORIZED: '승인되지 않은 유저입니다.',
    FORBIDDEN: '권한이 없는 유저의 요청입니다.',
    NOT_FOUND: '존재하지 않는 자원입니다.',
    DUPLICATED: '이미 존재하는 데이터입니다.',
    TEMPORARY_UNAVAILABLE: '일시적으로 사용할 수 없는 서버입니다.',
    INTERNAL_SERVER_ERROR: '서버 내부 오류입니다.',
    DB_ERROR: '데이터베이스 오류입니다.',
  
    NULL_VALUE: '필요한 값이 없습니다.',
    NULL_VALUE_TOKEN: '토큰이 없습니다.',
    EXPIRED_TOKEN: '만료된 토큰입니다.',
    INVALID_TOKEN: '존재하지 않는 토큰입니다.',
    INVALID_PASSWORD: '잘못된 비밀번호입니다.',
    INVALID_ID: '유효하지 않은 id입니다.',
  
    NOT_FOUND_USER_EMAIL: '가입되지 않은 이메일입니다.',
    CONFLICT_EMAIL: '이메일 중복입니다.',
  
    SIGNUP_SUCCESS: '회원가입 성공입니다.',
    LOGIN_SUCCESS: '로그인 성공입니다.',
  

    // 홈
    READ_ROOM_AT_HOME_SUCCESS: '홈화면 조회 성공입니다.',

    // 피드
    NOT_FOUND_FEED: '존재하지 않는 피드입니다.',
    CREATE_FEED_SUCCESS: '피드 생성 성공입니다.',
    UPDATE_FEED_SUCCESS: '피드 수정 성공입니다.',
    DELETE_FEED_SUCCESS: '피드 삭제 성공입니다.',
    READ_FEED_SUCCESS: '피드 조회 성공입니다.',
    FORBIDDEN_FEED: '참가하고 있지 않은 그룹의 피드입니다.',


    // 캘린더
    NOT_FOUND_CAL: '존재하지 않는 일정입니다.',
    CREATE_CAL_SUCCESS: '일정 생성 성공입니다.',
    UPDATE_CAL_SUCCESS: '일정 수정 성공입니다.',
    DELETE_CAL_SUCCESS: '일정 삭제 성공입니다.',
    READ_CAL_SUCCESS: '일정 조회 성공입니다.',
    READ_ONE_CAL_SUCCESS: '일정 조회 성공입니다.',
    READ_THISWEEK_SUCCESS: '이번주 일정 조회 성공입니다.',
    READ_THIMONTH_SUCCESS: '이번달 일정 조회 성공입니다.',
    CREATE_SCDL_SUCCESS: '스케줄 생성 성공입니다.',
    READ_SCDL_SUCCESS: '스케줄 조회 성공입니다.',
    CREATE_TS_SUCCESS: '타임슬럿 생성 성공입니다.',
    READ_TS_SUCCESS: '타임슬럿 조회 성공입니다.',
    DELETE_SCDL_TS_SUCCESS: '스케줄,타임슬럿 삭제 성공입니다.',
    FORBIDDEN_CAL: '참가하고 있지 않은 그룹의 캘린더입니다.',


    // 가계부
    NOT_FOUND_BUDGET: '존재하지 않는 지출입니다.',
    CREATE_BUDGET_SUCCESS: '지출 생성 성공입니다.',
    UPDATE_BUDGET_SUCCESS: '지출 수정 성공입니다.',
    DELETE_CBUDGET_SUCCESS: '지출 삭제 성공입니다.',
    READ_BUDGET_SUCCESS: '지출 조회 성공입니다.',
    FIND_BUDGET_SUCCESS:'지출 찾기 성공입니다.',
    UPDATE_BUDGET_CATEG_SUCCESS: '지출 카테고리 수정 성공입니다.',
    DELETE_BUDGET_CATEG_SUCCESS: '지출 카테고리 삭제 성공입니다.',
    BUDGET_CALC_SUCCESS: '지출 정산 성공입니다.',
    BUDGET_CALCULATE_SUCCESS: '정산하기를 완료했습니다.',
    FORBIDDEN_BUDGET: '참가하고 있지 않은 그룹의 지출입니다.',


    // 알림
    GET_NOTIFICATION_SUCCESS: '알림 반환 성공입니다.',

    
    // 그룹
    NOT_FOUND_GROUP: '존재하지 않는 그룹입니다.',
    CONFLICT_JOINED_GROUP: '참가중인 그룹이 있습니다.',
    FORBIDDEN_GROUP: '참가하고 있지 않은 그룹에 접근할 수 없습니다.',
  
    READ_GROUP_SUCCESS: '그룹 조회 성공입니다.',
    CREATE_GROUP_SUCCESS: '그룹 생성 성공입니다.',
    UPDATE_GROUP_SUCCESS: '그룹 이름 변경 성공입니다.',
    JOIN_GROUP_SUCCESS: '그룹 참가 성공입니다.',
    LEAVE_GROUP_SUCCESS: '그룹 탈퇴 성공입니다.',
    INVITATION_GROUP_SUCCESS: '그룹 코드를 발급했습니다.',
  

    // 사용자
    READ_USER_SUCCESS: '사용자 정보 조회 성공입니다.',
    READ_MEMBERS_SUCCESS: '모든 유저 정보 조회 성공입니다.',
    UPDATE_USER_SUCCESS: '사용자 정보 수정 성공입니다.',
    NOT_FOUND_USER: '조회할 사용자 정보가 없습니다.',
    FORBIDDEN_USER: '참가하고 있지 않은 방의 사용자입니다.',
    READ_USER_NOTIFICATION_SUCCESS: '사용자 알림 조회 성공입니다.',
    READ_MYPAGE_SUCCESS: '마이페이지 반환 성공입니다.',
    UPDATE_USER_NOTIFICATION_STATE_SUCCESS: '사용자 알림 설정 수정 성공입니다.',
    DELETE_USER_SUCCESS: '사용자 탈퇴 성공입니다.',
    

  };
  
  export default message;