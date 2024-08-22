import * as AppConst from '../const/const';
import JwtDecode from 'jwt-decode';


export async function get_email() {
    let email = null
    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            email = user.email
            return email
        } else {
            return email
        }
    } catch (error) {
        console.error(error)
        return email
    }

}

export async function get_user_id() {
    let user_id = null
    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            user_id = user._id
            return user_id
        }
        return user_id
    } catch (error) {
        console.error(error)
        return user_id
    }
}

export async function get_user_role() {
    let role = null
    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            role = user.role
            return role
        }
        return role
    } catch (error) {
        console.error(error)
        return role
    }
}

export async function get_user_details() {
    let user = null
    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            return fetch(AppConst.FIND_EMPLOYEE, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + userToken,
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success) {
                        user = res.data
                        return user
                    } else {
                        return user
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return user
                });
        } else {
            return user
        }
    } catch (error) {
        console.error(error)
        return user
    }
}

export function get_all_employees() {

    return fetch(AppConst.GET_All_EMPLOYIES, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((res) => {
            return res
        })
        .catch((error) => {
            console.error(error);
        });
}

export async function get_my_tasks() {
    var all = []

    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id
            return fetch(AppConst.GET_All_TASKS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            var e_date;
                            if (res[i].task.asign._id == user_id) {
                                // if (res[i].task.complete != "Completed") {
                                e_date = new Date(res[i].task.ending_date)
                                all.push({
                                    task_id: res[i]._id,
                                    sub_task_id: undefined,
                                    name: res[i].task.name,
                                    level: "level_one",
                                    ending_date: res[i].task.ending_date,
                                    type: res[i].type,
                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                    comment_count: res[i].task.comments.length,
                                    priority: res[i].task.priority,
                                    complete: res[i].task.complete,
                                    enabled: true
                                })
                                // }
                                for (var j = 0; j < res[i].task.level_two.length; j++) {
                                    if (res[i].task.level_two[j].asign._id == user_id) {
                                        // if (res[i].task.level_two[j].complete != "Completed") {
                                        e_date = new Date(res[i].task.level_two[j].ending_date)
                                        all.push({
                                            task_id: res[i]._id,
                                            sub_task_id: res[i].task.level_two[j]._id,
                                            name: res[i].task.level_two[j].name,
                                            level: "level_two",
                                            ending_date: res[i].task.level_two[j].ending_date,
                                            type: "one time",
                                            e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                            comment_count: res[i].task.level_two[j].comments.length,
                                            priority: res[i].task.level_two[j].priority,
                                            complete: res[i].task.level_two[j].complete,
                                            enabled: true
                                        })
                                        // }
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].level_three[k].asign._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: true
                                                })
                                            }
                                        }
                                        // }
                                    } else {
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].task.level_three[k].asign._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: true
                                                })
                                                // }
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var j = 0; j < res[i].task.level_two.length; j++) {
                                    if (res[i].task.level_two[j].asign._id == user_id) {
                                        // if (res[i].task.level_two[j].complete != "Completed") {
                                        e_date = new Date(res[i].task.level_two[j].ending_date)
                                        all.push({
                                            task_id: res[i]._id,
                                            sub_task_id: res[i].task.level_two[j]._id,
                                            name: res[i].task.level_two[j].name,
                                            level: "level_two",
                                            ending_date: res[i].task.level_two[j].ending_date,
                                            type: "one time",
                                            e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                            comment_count: res[i].task.level_two[j].comments.length,
                                            priority: res[i].task.level_two[j].priority,
                                            complete: res[i].task.level_two[j].complete,
                                            enabled: true
                                        })
                                        // }
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].level_three[k].asign._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: true
                                                })
                                                // }
                                            }
                                        }
                                    } else {
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].level_three[k].asign._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: true
                                                })
                                                // }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return all
                    } else {
                        return all
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return all
                });
        } else {
            return all
        }
    } catch (error) {
        console.error(error)
        return all
    }

}

export async function get_my_project_tasks() {
    var all = []

    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id

            return fetch(AppConst.GET_All_PROJECTS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            for (var j = 0; j < res[i].tasks.length; j++) {
                                var e_date;
                                if (res[i].tasks[j].asign._id == user_id) {
                                    // if (res[i].tasks[j].complete!="Completed") {
                                    e_date = new Date(res[i].tasks[j].ending_date)
                                    all.push({
                                        project_name: res[i].basic.name,
                                        project_id: res[i]._id,
                                        task_id: res[i].tasks[j]._id,
                                        name: res[i].tasks[j].name,
                                        level: "level_one",
                                        ending_date: res[i].tasks[j].ending_date,
                                        type: "Project Task",
                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                        comment_count: res[i].tasks[j].comments.length,
                                        priority: res[i].tasks[j].priority,
                                        complete: res[i].tasks[j].complete,
                                        enabled: true
                                    })
                                    // }

                                    for (var k = 0; k < res[i].tasks[j].level_two.length; k++) {
                                        if (res[i].tasks[j].level_two[k].asign._id == user_id) {
                                            // if (res[i].tasks[j].level_two[k].complete!="Completed") {
                                            e_date = new Date(res[i].tasks[j].level_two[k].ending_date)
                                            all.push({
                                                project_name: res[i].basic.name,
                                                project_id: res[i]._id,
                                                task_id: res[i].tasks[j].level_two[k]._id,
                                                name: res[i].tasks[j].level_two[k].name,
                                                level: "level_two",
                                                ending_date: res[i].tasks[j].level_two[k].ending_date,
                                                type: "Project Task",
                                                e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                comment_count: res[i].tasks[j].level_two[k].comments.length,
                                                priority: res[i].tasks[j].level_two[k].priority,
                                                complete: res[i].tasks[j].level_two[k].complete,
                                                enabled: true
                                            })
                                            // }
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].asign._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete!="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: true
                                                    })
                                                    // }
                                                }
                                            }
                                        } else {
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].asign._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete!="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: true
                                                    })
                                                    // }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    for (var k = 0; k < res[i].tasks[j].level_two.length; k++) {
                                        if (res[i].tasks[j].level_two[k].asign._id == user_id) {
                                            // if (res[i].tasks[j].level_two[k].complete!="Completed") {
                                            e_date = new Date(res[i].tasks[j].level_two[k].ending_date)
                                            all.push({
                                                project_name: res[i].basic.name,
                                                project_id: res[i]._id,
                                                task_id: res[i].tasks[j].level_two[k]._id,
                                                name: res[i].tasks[j].level_two[k].name,
                                                level: "level_two",
                                                ending_date: res[i].tasks[j].level_two[k].ending_date,
                                                type: "Project Task",
                                                e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                comment_count: res[i].tasks[j].level_two[k].comments.length,
                                                priority: res[i].tasks[j].level_two[k].priority,
                                                complete: res[i].tasks[j].level_two[k].complete,
                                                enabled: true
                                            })
                                            // }
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].asign._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete!="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: true
                                                    })
                                                    // }
                                                }
                                            }
                                        } else {
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].asign._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete !="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: true
                                                    })
                                                    // }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return all
                    } else {
                        return all
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return all
                });
        } else {
            return all
        }
    } catch (error) {
        console.error(error)
        return all
    }

}

export async function get_reported_tasks() {
    var all = []

    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id
            return fetch(AppConst.GET_All_TASKS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            var e_date;
                            if (res[i].task.report._id == user_id) {
                                // if (res[i].task.complete != "Completed") {
                                e_date = new Date(res[i].task.ending_date)
                                all.push({
                                    task_id: res[i]._id,
                                    sub_task_id: undefined,
                                    name: res[i].task.name,
                                    level: "level_one",
                                    ending_date: res[i].task.ending_date,
                                    type: res[i].type,
                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                    comment_count: res[i].task.comments.length,
                                    priority: res[i].task.priority,
                                    complete: res[i].task.complete,
                                    enabled: false
                                })
                                // }
                                for (var j = 0; j < res[i].task.level_two.length; j++) {
                                    if (res[i].task.level_two[j].report._id == user_id) {
                                        // if (res[i].task.level_two[j].complete != "Completed") {
                                        e_date = new Date(res[i].task.level_two[j].ending_date)
                                        all.push({
                                            task_id: res[i]._id,
                                            sub_task_id: res[i].task.level_two[j]._id,
                                            name: res[i].task.level_two[j].name,
                                            level: "level_two",
                                            ending_date: res[i].task.level_two[j].ending_date,
                                            type: "one time",
                                            e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                            comment_count: res[i].task.level_two[j].comments.length,
                                            priority: res[i].task.level_two[j].priority,
                                            complete: res[i].task.level_two[j].complete,
                                            enabled: false
                                        })
                                        // }
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].level_three[k].report._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: false
                                                })
                                            }
                                        }
                                        // }
                                    } else {
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].task.level_three[k].report._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: false
                                                })
                                                // }
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var j = 0; j < res[i].task.level_two.length; j++) {
                                    if (res[i].task.level_two[j].report._id == user_id) {
                                        // if (res[i].task.level_two[j].complete != "Completed") {
                                        e_date = new Date(res[i].task.level_two[j].ending_date)
                                        all.push({
                                            task_id: res[i]._id,
                                            sub_task_id: res[i].task.level_two[j]._id,
                                            name: res[i].task.level_two[j].name,
                                            level: "level_two",
                                            ending_date: res[i].task.level_two[j].ending_date,
                                            type: "one time",
                                            e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                            comment_count: res[i].task.level_two[j].comments.length,
                                            priority: res[i].task.level_two[j].priority,
                                            complete: res[i].task.level_two[j].complete,
                                            enabled: false
                                        })
                                        // }
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].level_three[k].report._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: false
                                                })
                                                // }
                                            }
                                        }
                                    } else {
                                        for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                            if (res[i].task.level_two[j].level_three[k].report._id == user_id) {
                                                // if (res[i].task.level_two[j].level_three[k].complete != "Completed") {
                                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                                all.push({
                                                    task_id: res[i]._id,
                                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                                    name: res[i].task.level_two[j].level_three[k].name,
                                                    level: "level_three",
                                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                                    type: "one time",
                                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                                    enabled: false
                                                })
                                                // }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return all
                    } else {
                        return all
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return all
                });
        } else {
            return all
        }
    } catch (error) {
        console.error(error)
        return all
    }

}

export async function get_reported_project_tasks() {
    var all = []

    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id

            return fetch(AppConst.GET_All_PROJECTS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            for (var j = 0; j < res[i].tasks.length; j++) {
                                var e_date;
                                if (res[i].tasks[j].report._id == user_id) {
                                    // if (res[i].tasks[j].complete!="Completed") {
                                    e_date = new Date(res[i].tasks[j].ending_date)
                                    all.push({
                                        project_name: res[i].basic.name,
                                        project_id: res[i]._id,
                                        task_id: res[i].tasks[j]._id,
                                        name: res[i].tasks[j].name,
                                        level: "level_one",
                                        ending_date: res[i].tasks[j].ending_date,
                                        type: "Project Task",
                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                        comment_count: res[i].tasks[j].comments.length,
                                        priority: res[i].tasks[j].priority,
                                        complete: res[i].tasks[j].complete,
                                        enabled: false
                                    })
                                    // }

                                    for (var k = 0; k < res[i].tasks[j].level_two.length; k++) {
                                        if (res[i].tasks[j].level_two[k].report._id == user_id) {
                                            // if (res[i].tasks[j].level_two[k].complete!="Completed") {
                                            e_date = new Date(res[i].tasks[j].level_two[k].ending_date)
                                            all.push({
                                                project_name: res[i].basic.name,
                                                project_id: res[i]._id,
                                                task_id: res[i].tasks[j].level_two[k]._id,
                                                name: res[i].tasks[j].level_two[k].name,
                                                level: "level_two",
                                                ending_date: res[i].tasks[j].level_two[k].ending_date,
                                                type: "Project Task",
                                                e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                comment_count: res[i].tasks[j].level_two[k].comments.length,
                                                priority: res[i].tasks[j].level_two[k].priority,
                                                complete: res[i].tasks[j].level_two[k].complete,
                                                enabled: false
                                            })
                                            // }
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].report._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete!="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: false
                                                    })
                                                    // }
                                                }
                                            }
                                        } else {
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].report._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete!="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: false
                                                    })
                                                    // }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    for (var k = 0; k < res[i].tasks[j].level_two.length; k++) {
                                        if (res[i].tasks[j].level_two[k].report._id == user_id) {
                                            // if (res[i].tasks[j].level_two[k].complete!="Completed") {
                                            e_date = new Date(res[i].tasks[j].level_two[k].ending_date)
                                            all.push({
                                                project_name: res[i].basic.name,
                                                project_id: res[i]._id,
                                                task_id: res[i].tasks[j].level_two[k]._id,
                                                name: res[i].tasks[j].level_two[k].name,
                                                level: "level_two",
                                                ending_date: res[i].tasks[j].level_two[k].ending_date,
                                                type: "Project Task",
                                                e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                comment_count: res[i].tasks[j].level_two[k].comments.length,
                                                priority: res[i].tasks[j].level_two[k].priority,
                                                complete: res[i].tasks[j].level_two[k].complete,
                                                enabled: false
                                            })
                                            // }
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].report._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete!="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: false
                                                    })
                                                    // }
                                                }
                                            }
                                        } else {
                                            for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                                if (res[i].tasks[j].level_two[k].level_three[l].report._id == user_id) {
                                                    // if (res[i].tasks[j].level_two[k].level_three[l].complete !="Completed") {
                                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                                    all.push({
                                                        project_name: res[i].basic.name,
                                                        project_id: res[i]._id,
                                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                                        level: "level_three",
                                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                                        type: "Project Task",
                                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                                        enabled: false
                                                    })
                                                    // }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return all
                    } else {
                        return all
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return all
                });
        } else {
            return all
        }
    } catch (error) {
        console.error(error)
        return all
    }

}

export async function get_all_tasks() {
    var all = []

    try {
        return fetch(AppConst.GET_All_TASKS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        var e_date;
                        e_date = new Date(res[i].task.ending_date)
                        all.push({
                            task_id: res[i]._id,
                            sub_task_id: undefined,
                            name: res[i].task.name,
                            level: "level_one",
                            ending_date: res[i].task.ending_date,
                            type: res[i].type,
                            e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                            comment_count: res[i].task.comments.length,
                            priority: res[i].task.priority,
                            complete: res[i].task.complete,
                            enabled: false
                        })
                        for (var j = 0; j < res[i].task.level_two.length; j++) {
                            e_date = new Date(res[i].task.level_two[j].ending_date)
                            all.push({
                                task_id: res[i]._id,
                                sub_task_id: res[i].task.level_two[j]._id,
                                name: res[i].task.level_two[j].name,
                                level: "level_two",
                                ending_date: res[i].task.level_two[j].ending_date,
                                type: "one time",
                                e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                comment_count: res[i].task.level_two[j].comments.length,
                                priority: res[i].task.level_two[j].priority,
                                complete: res[i].task.level_two[j].complete,
                                enabled: false
                            })

                            for (var k = 0; k < res[i].task.level_two[j].level_three.length; k++) {
                                e_date = new Date(res[i].task.level_two[j].level_three[k].ending_date)
                                all.push({
                                    task_id: res[i]._id,
                                    sub_task_id: res[i].task.level_two[j].level_three[k]._id,
                                    name: res[i].task.level_two[j].level_three[k].name,
                                    level: "level_three",
                                    ending_date: res[i].task.level_two[j].level_three[k].ending_date,
                                    type: "one time",
                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                    comment_count: res[i].task.level_two[j].level_three[k].comments.length,
                                    priority: res[i].task.level_two[j].level_three[k].priority,
                                    complete: res[i].task.level_two[j].level_three[k].complete,
                                    enabled: false
                                })
                            }
                        }
                    }
                    return all
                } else {
                    return all
                }
            })
            .catch((error) => {
                console.error(error);
                return all
            });
    } catch (error) {
        console.error(error)
        return all
    }

}

export async function get_all_project_tasks() {
    var all = []

    try {
        return fetch(AppConst.GET_All_PROJECTS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        for (var j = 0; j < res[i].tasks.length; j++) {
                            var e_date;
                            e_date = new Date(res[i].tasks[j].ending_date)
                            all.push({
                                project_name: res[i].basic.name,
                                project_id: res[i]._id,
                                task_id: res[i].tasks[j]._id,
                                name: res[i].tasks[j].name,
                                level: "level_one",
                                ending_date: res[i].tasks[j].ending_date,
                                type: "Project Task",
                                e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                comment_count: res[i].tasks[j].comments.length,
                                priority: res[i].tasks[j].priority,
                                complete: res[i].tasks[j].complete,
                                enabled: false
                            })
                            for (var k = 0; k < res[i].tasks[j].level_two.length; k++) {
                                e_date = new Date(res[i].tasks[j].level_two[k].ending_date)
                                all.push({
                                    project_name: res[i].basic.name,
                                    project_id: res[i]._id,
                                    task_id: res[i].tasks[j].level_two[k]._id,
                                    name: res[i].tasks[j].level_two[k].name,
                                    level: "level_two",
                                    ending_date: res[i].tasks[j].level_two[k].ending_date,
                                    type: "Project Task",
                                    e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                    comment_count: res[i].tasks[j].level_two[k].comments.length,
                                    priority: res[i].tasks[j].level_two[k].priority,
                                    complete: res[i].tasks[j].level_two[k].complete,
                                    enabled: false
                                })

                                for (var l = 0; l < res[i].tasks[j].level_two[k].level_three.length; l++) {
                                    e_date = new Date(res[i].tasks[j].level_two[k].level_three[l].ending_date)
                                    all.push({
                                        project_name: res[i].basic.name,
                                        project_id: res[i]._id,
                                        task_id: res[i].tasks[j].level_two[k].level_three[l]._id,
                                        name: res[i].tasks[j].level_two[k].level_three[l].name,
                                        level: "level_three",
                                        ending_date: res[i].tasks[j].level_two[k].level_three[l].ending_date,
                                        type: "Project Task",
                                        e_date: e_date.getFullYear() + "/" + (e_date.getMonth() + 1) + "/" + e_date.getDate(),
                                        comment_count: res[i].tasks[j].level_two[k].level_three[l].comments.length,
                                        priority: res[i].tasks[j].level_two[k].level_three[l].priority,
                                        complete: res[i].tasks[j].level_two[k].level_three[l].complete,
                                        enabled: false
                                    })
                                }
                            }
                        }
                    }
                    return all
                } else {
                    return all
                }
            })
            .catch((error) => {
                console.error(error);
                return all
            });
    } catch (error) {
        console.error(error)
        return all
    }

}

export async function get_my_teams() {
    var all = []

    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id

            return fetch(AppConst.GET_All_TEAMS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            var contain = false;
                            for (var k = 0; k < res[i].members.length; k++) {
                                if (res[i].members[k].user._id == user_id) {
                                    contain = true;
                                }
                            }
                            if (contain) {
                                all.push(res[i])
                            }
                        }
                        return all
                    } else {
                        return all
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return all
                });
        } else {
            return all
        }
    } catch (error) {
        console.error(error)
        return all
    }
}

export async function get_my_projects() {
    var all = []
    return fetch(AppConst.GET_All_PROJECTS, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((res) => {
            return res
        })
        .catch((error) => {
            console.error(error);
            return all
        });
}

export async function get_all_projects() {

    return fetch(AppConst.GET_All_PROJECTS, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((res) => {
            return res
        })
        .catch((error) => {
            console.error(error);
            return null
        });
}

export async function find_task(id) {
    var find = []
    return fetch(AppConst.FIND_TASK + id, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((res) => {
            if (res.success) {
                find = res.data
                return find
            } else {
                return find
            }
        })
        .catch((error) => {
            console.error(error);
            return find
        });
}

export async function find_project(id) {
    var find = []
    return fetch(AppConst.FIND_PROJECTS + id, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((res) => {
            if (res.success) {
                find = res.data
                return find
            } else {
                return find
            }
        })
        .catch((error) => {
            console.error(error);
            return find
        });
}

export async function login(data) {

    return fetch(AppConst.LOGIN, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password,
        }),
    })
        .then((response) => response.json())
        .then(async (res) => {
            return res
        })
        .catch((error) => {
            console.error(error);
            return null
        });

}

export async function save_progress(data) {
    try {
        let userToken = await AsyncStorage.getItem('Token');
        return fetch(AppConst.CREATE_WORK, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: data.date,
                in: data.in,
                out: data.out,
                rate: data.rate,
                reason: data.reason,
                tasks: data.tasks
            }),
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function subcribe_notification(data, token) {
    try {
        var user = JwtDecode(token);
        const user_id = user._id
        return fetch(AppConst.SUBCRIBE + user_id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: data.key,
                app: data.app
            }),
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function unsubcribe_notification() {
    try {
        let key = await AsyncStorage.getItem('Key');
        if (key) {
            return fetch(AppConst.UNSUBCRIBE, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: key
                }),
            })
                .then((response) => response.json())
                .then(async (res) => {
                    return res
                })
                .catch((error) => {
                    console.error(error);
                    return null
                });
        } else {
            return null
        }
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function save_new_task(data) {
    try {
        return fetch(AppConst.CREATE_TASK, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: data.type,
                task: data.task,
                repeat: data.repeat
            }),
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function save_sub_task(data, t_id, st_id, level) {
    try {
        return fetch(AppConst.ADD_SUB_TASK + t_id + "/" + st_id + "/" + level, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                ending_date: data.ending_date,
                priority: data.priority,
                description: data.description,
                state: data.state,
                duration: data.duration,
                asign: data.asign,
                report: data.report,
                notify: data.notify
            }),
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function save_project_task(data, id) {
    try {
        return fetch(AppConst.ADD_PROJECTS_TASK + id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                ending_date: data.ending_date,
                priority: data.priority,
                description: data.description,
                state: data.state,
                duration: data.duration,
                asign: data.asign,
                report: data.report,
                notify: data.notify
            }),
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function save_project_sub_task(data, p_id, t_id, level) {
    try {
        return fetch(AppConst.ADD_PROJECTS_SUB_TASK + p_id + "/" + t_id + "/" + level, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                ending_date: data.ending_date,
                priority: data.priority,
                description: data.description,
                state: data.state,
                duration: data.duration,
                asign: data.asign,
                report: data.report,
                notify: data.notify
            }),
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}

export async function get_notifications() {
    let notifications = []
    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id

            return fetch(AppConst.GET_MY_NOTIFICATIONS + user_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {
                    notifications = res
                    return notifications
                })
                .catch((error) => {
                    console.error(error);
                    return notifications
                });
        } else {
            return notifications
        }
    } catch (error) {
        console.error(error)
        return notifications
    }
}

export async function get_notifications_count() {
    let count = 0
    try {
        let userToken = await AsyncStorage.getItem('Token');
        if (userToken) {
            var user = JwtDecode(userToken);
            const user_id = user._id

            return fetch(AppConst.GET_MY_NOTIFICATIONS + user_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((res) => {

                    if (res) {
                        for (let index = 0; index < res.length; index++) {

                            if (res[index].status == "new") {
                                count++
                            }

                        }
                    }
                    return count
                })
                .catch((error) => {
                    console.error(error);
                    return count
                });
        } else {
            return count
        }
    } catch (error) {
        console.error(error)
        return count
    }
}

export async function read_notification(id) {
    try {
        return fetch(AppConst.READ_NOTIFICATION + id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then(async (res) => {
                return res
            })
            .catch((error) => {
                console.error(error);
                return null
            });
    } catch (error) {
        console.error(error);
        return null
    };
}
