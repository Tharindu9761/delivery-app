// deploy server
// const MAIN = 'http://ec2-3-16-107-30.us-east-2.compute.amazonaws.com'
// export const PROJECT_PIC = "http://ec2-3-16-107-30.us-east-2.compute.amazonaws.com/project/"



// test server
// const MAIN = 'http://ec2-3-19-245-139.us-east-2.compute.amazonaws.com'
// export const PROJECT_PIC ="http://ec2-3-19-245-139.us-east-2.compute.amazonaws.com/project/"

const MAIN = 'https://api.tasktracker.serenitygroup.net'
export const PROJECT_PIC = "https://api.tasktracker.serenitygroup.net/project/"



// const MAIN="http://192.168.1.2:3008"

//employee url 
export const LOGIN = generateUrl("employee/login");
export const NEW_PASSWORD = generateUrl("employee/update_password");

//department url
export const GET_All_DEPARTMENTS = generateUrl("department/all");
export const CREATE_DEPARTMENT = generateUrl("department/create");
export const UPDATE_DEPARTMENT = generateUrl("department/update/");
export const DELETE_DEPARTMENT = generateUrl("department/delete/");
export const FIND_DEPARTMENT = generateUrl("department/find/");

//team url
export const GET_All_TEAMS = generateUrl("team/all");
export const CREATE_TEAM = generateUrl("team/create");
export const UPDATE_TEAM = generateUrl("team/update/");
export const DELETE_TEAM = generateUrl("team/delete/");
export const FIND_TEAM = generateUrl("team/find/");

//job url
export const GET_All_JOBS = generateUrl("job/all");
export const CREATE_JOB = generateUrl("job/create");
export const UPDATE_JOB = generateUrl("job/update/");
export const DELETE_JOB = generateUrl("job/delete/");
export const FIND_JOB = generateUrl("job/find/");

//categoryurl
export const GET_All_CATEGORIES = generateUrl("category/all");
export const CREATE_CATEGORY = generateUrl("category/create");
export const UPDATE_CATEGORY = generateUrl("category/update/");
export const DELETE_CATEGORY = generateUrl("category/delete/");
export const FIND_CATEGORY = generateUrl("category/find/");

//designation url
export const GET_All_DESIGNATIONS = generateUrl("designation/all");
export const CREATE_DESIGNATION = generateUrl("designation/create");
export const UPDATE_DESIGNATION = generateUrl("designation/update/");
export const DELETE_DESIGNATION = generateUrl("designation/delete/");
export const FIND_DESIGNATION = generateUrl("designation/find/");

//leave url
export const GET_All_LEAVES = generateUrl("leave/all");
export const CREATE_LEAVE = generateUrl("leave/create");
export const UPDATE_LEAVE = generateUrl("leave/update/");
export const DELETE_LEAVE = generateUrl("leave/delete/");
export const FIND_LEAVE = generateUrl("leave/find/");

//Mandatory leave url
export const CREATE_MANDATORY_LEAVE = generateUrl("mandatory/create");
export const GET_All_MANDATORY_LEAVES = generateUrl("mandatory/all");
export const GET_All_BRANCH_LEAVES = generateUrl("mandatory/branch/all");

//company url
export const GET_All_COMPANIES = generateUrl("company/all");
export const CREATE_COMPANY = generateUrl("company/create");
export const UPDATE_COMPANY = generateUrl("company/update/");
export const DELETE_COMPANY = generateUrl("company/delete/");
export const FIND_COMPANY = generateUrl("company/find/");
export const GET_COMPANY_LOGO = generateUrl("company/logo");
export const SAVE_COMPANY_LOGO = generateUrl("company/create/logo");


//branch url
export const CREATE_BRANCH = generateUrl("company/add/branch");
export const UPDATE_BRANCH = generateUrl("company/update/branch/");
export const DELETE_BRANCH = generateUrl("company/delete/branch/");
export const GET_All_BRANCHES = generateUrl("company/all/branches");
export const FIND_BRANCH = generateUrl("company/find/branch/");

//employee url
export const CREATE_EMPLOYEE = generateUrl("employee/create");
export const UPDATE_EMPLOYEE_PROFILE = generateUrl("employee/update/");
export const DELETE_EMPLOYEE = generateUrl("employee/delete/");
export const GET_All_EMPLOYIES = generateUrl("employee/all");
export const FIND_EMPLOYEE = generateUrl("employee/find/");
export const GET_PIC = generateUrl("employee/pic/");
export const SAVE_PIC = generateUrl("employee/pic/update");
export const SAVE_NIC = generateUrl("employee/nic/");
export const GET_NIC = generateUrl("employee/nic/");
export const GET_LEAVES = generateUrl("employee/leaves");
export const GET_All_ATENDANCE = generateUrl("employee/atendance");
export const GET_ALL_LEAVE_LEAVES = generateUrl("employee/all/leave_leave");
export const UPDATE_LEAVE_LEAVES = generateUrl("employee/update_leave");
export const GET_THUMB = generateUrl("employee/thumb/");
export const GET_FULL = generateUrl("employee/full/");

//leave request url
export const CREATE_LEAVE_REQUEST = generateUrl("leave_request/create");
export const UPDATE_LEAVE_REQUEST = generateUrl("leave_request/update/");
export const DELETE_LEAVE_REQUEST = generateUrl("leave_request/delete/");
export const GET_All_LEAVE_REQUEST = generateUrl("leave_request/all");
export const GET_All_MY_LEAVE_REQUEST = generateUrl("leave_request/all/my");
export const FIND_LEAVE_REQUEST = generateUrl("leave_request/find/");
export const CANCEL_LEAVE_REQUEST = generateUrl("leave_request/cancel/");
export const APP_REJ_LEAVE_REQUEST = generateUrl("leave_request/update/");


// email url
export const GET_All_EMAILS = generateUrl("email/all/");
export const UPDATE_EMAIL = generateUrl("email/update/");

//work url
export const GET_All_WORKS = generateUrl("work/all");
export const CREATE_WORK = generateUrl("work/create");
export const UPDATE_WORK = generateUrl("work/update/");
export const DELETE_WORK = generateUrl("work/delete/");
export const FIND_WORK = generateUrl("work/find/");

//project url
export const GET_All_PROJECTS = generateUrl("project/all");
export const CREATE_PROJECTS = generateUrl("project/create");
export const UPDATE_PROJECTS = generateUrl("project/update/");
export const DELETE_PROJECTS = generateUrl("project/delete/");
export const FIND_PROJECTS = generateUrl("project/find/");
export const GET_PROJECT_IMAGE = generateUrl("project/image/");
export const ADD_PROJECTS_TASK = generateUrl("project/add/task/");
export const UPDATE_PROJECTS_TASK = generateUrl("project/update/task/");
export const ADD_PROJECTS_SUB_TASK = generateUrl("project/add/sub_task/");
export const DELETE_PROJECTS_TASK = generateUrl("project/delete/task");
export const COMMENT_PROJECTS_TASK = generateUrl("project/comment/");
export const COMPELETION_PROJECT_TASK = generateUrl("project/completion/");
export const COMPLETE_PROJECT_TASK = generateUrl("project/complete/");
export const APPROVE_REJECT_PROJECT_TASK = generateUrl("project/approve/");


// csv url
export const GET_All_EMPLOYEES_CSV = generateUrl("csv/employee/all");
export const GET_EMPLOYEE_CSV = generateUrl("csv/employee/find/");
export const GET_LEAVE_HOME_CSV = generateUrl("csv/leave/all/");


//task url
export const GET_All_TASKS = generateUrl("task/all");
export const CREATE_TASK = generateUrl("task/create");
export const UPDATE_TASK = generateUrl("task/update/");
export const DELETE_TASK = generateUrl("task/delete/");
export const FIND_TASK = generateUrl("task/find/");
export const ADD_SUB_TASK = generateUrl("task/add/sub_task/");
export const UPDATE_SUB_TASK = generateUrl("task/update/sub_task/");
export const DELETE_SUB_TASK = generateUrl("task/delete/sub_task");
export const COMMENT_TASK = generateUrl("task/comment/");
export const COMPELETION_TASK = generateUrl("task/completion/");
export const COMPLETE_TASK = generateUrl("task/complete/");
export const APPROVE_REJECT_TASK = generateUrl("task/approve/");

export const SUBCRIBE = generateUrl("massage/subcribe/");
export const UNSUBCRIBE = generateUrl("massage/unsubcribe");

export const GET_MY_NOTIFICATIONS = generateUrl("notification/all/");
export const READ_NOTIFICATION = generateUrl("notification/read/");

function generateUrl(url) {
    return MAIN + "/api/" + url
}