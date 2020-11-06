
const db = require('./db');
const queryInterface = db.getQueryInterface();




module.exports = {
    userInsert: () => {
        queryInterface.bulkInsert('users', [
            {
                user_id: 1,
                user_name: 'Rameez A',
                user_type: 'USER',
                user_email: 'ra@email.com',
                user_password: 'password'
            },
            {
                user_id: 2,
                user_name: 'Nermin D',
                user_type: 'USER',
                user_email: 'nd@email.com',
                user_password: 'password'
            },
            {
                user_id: 3,
                user_name: 'Jiten P',
                user_type: 'USER',
                user_email: 'jp@email.com',
                user_password: 'password'
            },
            {
                user_id: 4,
                user_name: 'Andrea B',
                user_type: 'USER',
                user_email: 'ab@email.com',
                user_password: 'password'
            },
            {
                user_id: 5,
                user_name: 'Dimitri V',
                user_type: 'USER',
                user_email: 'dv@email.com',
                user_password: 'password'
            },
            {
                user_id: 6,
                user_name: 'Randy L',
                user_type: 'USER',
                user_email: 'rl@email.com',
                user_password: 'password'
            },
            {
                user_id: 7,
                user_name: 'Eryk C',
                user_type: 'USER',
                user_email: 'ec@email.com',
                user_password: 'password'
            },
            {
                user_id: 8,
                user_name: 'Faculty User',
                user_type: 'FACULTY',
                user_email: 'faculty@email.com',
                user_password: 'password'
            },
            {
                user_id: 9,
                user_name: 'Test User',
                user_type: 'USER',
                user_email: 'testuser@email.com',
                user_password: 'password',
                tasks_completed: 3,
                avg_contribution: 3,
                user_title: 'Tester',
                user_phone: '123-456-7890',
                user_location: 'Uganda'
            }
        ]).then( () => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    projectInsert: () => {
        queryInterface.bulkInsert('projects', [
            {
                proj_id: 1,
                proj_name: 'Capstone Project', //3
                proj_duedate: '2020-07-25',
                proj_membercount: 7,
                proj_description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis odit nemo quo, vero ducimus repudiandae cupiditate? Pariatur odit necessitatibus, libero quae expedita minima cum perspiciatis accusantium nobis itaque facere fugit eius amet? A, consectetur fuga voluptas molestias rerum possimus iste provident aut obcaecati labore maxime inventore, quos praesentium. Suscipit nostrum sed itaque rem quam quidem enim consequuntur impedit facere veritatis placeat rerum iusto soluta doloremque tenetur alias repellat quod, hic expedita qui aut sequi pariatur error. Ad ratione autem sunt deserunt possimus ipsa animi perspiciatis voluptatem, optio voluptatum quod, reprehenderit tempore doloribus? Eius dicta dolorum deleniti voluptate ut adipisci cupiditate minus, id vero fugiat. Beatae blanditiis ad voluptates dicta quis recusandae ipsum ratione doloremque, deserunt eos dolore officia nesciunt distinctio natus neque a ab vitae. Rem optio magni numquam suscipit corporis dignissimos quibusdam voluptates quisquam impedit minus velit adipisci quo debitis culpa odit explicabo aut dolore, quam ducimus facilis? Sit, quibusdam ad repudiandae repellat accusantium blanditiis ratione quidem, cupiditate totam nostrum quos consequuntur? Ullam reprehenderit nesciunt fugit consectetur? Sapiente tenetur inventore omnis quod, odit quos reiciendis expedita quia voluptates et nisi temporibus. Debitis ipsa molestias quo quia adipisci reprehenderit laborum? Blanditiis molestias libero iusto consequuntur, possimus sapiente, magni minima similique nobis minus enim dolore illum voluptatem sit iure repudiandae nesciunt quis, et ipsum voluptate obcaecati perspiciatis tempore. Commodi corporis, earum cum est pariatur assumenda aspernatur a ratione ad quos quod voluptatibus, excepturi temporibus illo! Aut voluptatum architecto laudantium quod ad voluptate, optio, alias, eveniet rem atque ipsum ab sed facilis.'
            },
            {
                proj_id: 2,
                proj_name: 'Project 2', //4
                proj_duedate: '2020-07-25',
                proj_membercount: 1,
                proj_description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis odit nemo quo, vero ducimus repudiandae cupiditate? Pariatur odit necessitatibus, libero quae expedita minima cum perspiciatis accusantium nobis itaque facere fugit eius amet? A, consectetur fuga voluptas molestias rerum possimus iste provident aut obcaecati labore maxime inventore, quos praesentium. Suscipit nostrum sed itaque rem quam quidem enim consequuntur impedit facere veritatis placeat rerum iusto soluta doloremque tenetur alias repellat quod, hic expedita qui aut sequi pariatur error. Ad ratione autem sunt deserunt possimus ipsa animi perspiciatis voluptatem, optio voluptatum quod, reprehenderit tempore doloribus? Eius dicta dolorum deleniti voluptate ut adipisci cupiditate minus, id vero fugiat. Beatae blanditiis ad voluptates dicta quis recusandae ipsum ratione doloremque, deserunt eos dolore officia nesciunt distinctio natus neque a ab vitae. Rem optio magni numquam suscipit corporis dignissimos quibusdam voluptates quisquam impedit minus velit adipisci quo debitis culpa odit explicabo aut dolore, quam ducimus facilis? Sit, quibusdam ad repudiandae repellat accusantium blanditiis ratione quidem, cupiditate totam nostrum quos consequuntur? Ullam reprehenderit nesciunt fugit consectetur? Sapiente tenetur inventore omnis quod, odit quos reiciendis expedita quia voluptates et nisi temporibus. Debitis ipsa molestias quo quia adipisci reprehenderit laborum? Blanditiis molestias libero iusto consequuntur, possimus sapiente, magni minima similique nobis minus enim dolore illum voluptatem sit iure repudiandae nesciunt quis, et ipsum voluptate obcaecati perspiciatis tempore. Commodi corporis, earum cum est pariatur assumenda aspernatur a ratione ad quos quod voluptatibus, excepturi temporibus illo! Aut voluptatum architecto laudantium quod ad voluptate, optio, alias, eveniet rem atque ipsum ab sed facilis.'
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    userProjectInsert: () => {
        queryInterface.bulkInsert('user_project', [
            {
                user_id: 1,
                proj_id: 1,
            },
            {
                user_id: 2,
                proj_id: 1,
            },
            {
                user_id: 3,
                proj_id: 1,
            },
            {
                user_id: 4,
                proj_id: 1,
            },
            {
                user_id: 5,
                proj_id: 1,
            },
            {
                user_id: 6,
                proj_id: 1,
            },
            {
                user_id: 7,
                proj_id: 1,
            }
        ]).then(() => {
            console.log('user_proj successfully entered rows');
        }).catch(err => {
            console.log("FAIL: \n" + err);
        });
    },
    groupInsert: () => {
        queryInterface.bulkInsert('groups', [
            {
                group_id: 1,
                group_name: 'Group 1',
                total_members: 3,
                proj_id: 1
            },
            {
                group_id: 2,
                group_name: 'Group 2',
                total_members: 4,
                proj_id: 1
            },
            {
                group_id: 3,
                group_name: 'Group 1',
                total_members: 3,
                proj_id: 2
            },
            {
                group_id: 4,
                group_name: 'Group 2',
                total_members: 3,
                proj_id: 2
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    taskInsert: () => {
        queryInterface.bulkInsert('tasks', [
            {
                task_id: 1,
                task_name: 'Task 1',
                task_description: 'Task 1 description',
                task_dueDate: '2020-07-20',
                task_overdue: false,
                task_status: 'Complete',
                group_id: 1
            },
            {
                task_id: 2,
                task_name: 'Task 2',
                task_description: 'Task 2 description',
                task_dueDate: '2020-07-20',
                task_overdue: false,
                task_status: 'Not Complete',
                group_id: 1
            },
            {
                task_id: 3,
                task_name: 'Task 3',
                task_description: 'Task 3 description',
                task_dueDate: '2020-07-20',
                task_overdue: true,
                task_status: 'Complete',
                group_id: 2
            },
            {
                task_id: 4,
                task_name: 'Task 4',
                task_description: 'Task 4 description',
                task_dueDate: '2020-07-20',
                task_overdue: true,
                task_status: 'Not Complete',
                group_id: 2
            },
            {
                task_id: 5,
                task_name: 'Task Dummy',
                task_description: 'Task dummy description',
                task_dueDate: '2020-07-20',
                task_overdue: false,
                task_status: 'Complete',
                group_id: 3
            },
            {
                task_id: 6,
                task_name: 'Task Dummy2',
                task_description: 'Task dummy2 description',
                task_dueDate: '2020-07-20',
                task_overdue: false,
                task_status: 'Not Complete',
                group_id: 4
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    userTaskInsert: () => {
        queryInterface.bulkInsert('user_task', [
            {
                user_id: 1,
                task_id: 1
            },
            {
                user_id: 2,
                task_id: 1
            },
            {
                user_id: 3,
                task_id: 2
            },
            {
                user_id: 4,
                task_id: 2
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    reviewInsert: () => {
        queryInterface.bulkInsert('reviews', [
            {
                review_id: 1,
                review_score: 5,
                proj_id: 1,
                task_id: 1,
                user_id: 1
            },
            {
                review_id: 2,
                review_score: 1,
                proj_id: 1,
                task_id: 1,
                user_id: 1
            },
            {
                review_id: 3,
                review_score: 5,
                proj_id: 1,
                task_id: 2,
                user_id: 2
            },
            {
                review_id: 4,
                review_score: 1,
                proj_id: 1,
                task_id: 2,
                user_id: 2
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    badgeInsert: () => {
        queryInterface.bulkInsert('badges', [
            {
                badge_id: 1,
                badge_img: 'allStarBadge.png',
                badge_name: 'All-Star Badge',
                badge_description: 'Perfect score from peers on a specific task!'
            },
            {
                badge_id: 2,
                badge_img: 'altruisticBadge.png',
                badge_name: 'Altruistic Badge',
                badge_description: 'Going above and beyond with helping your teammates!'
            },
            {
                badge_id: 3,
                badge_img: 'communicationBadge.png',
                badge_name: 'Communication Badge',
                badge_description: 'Crystal clear communication with teammates!'
            },
            {
                badge_id: 4,
                badge_img: 'firstTasksBadge.png',
                badge_name: 'First Task Badge',
                badge_description: 'Completed your first task!'
            },
            {
                badge_id: 5,
                badge_img: 'hardWorkerBadge.png',
                badge_name: 'Hard Worker Badge',
                badge_description: 'Worked exceptionally hard on a specific task!'
            },
            {
                badge_id: 6,
                badge_img: 'leadershipBadge.png',
                badge_name: 'Leadership Badge',
                badge_description: 'Led teammates on a specific task!'
            },
            {
                badge_id: 7,
                badge_img: 'tenTasksBadge.png',
                badge_name: 'Ten Task Badge',
                badge_description: 'Completed your tenth task!'
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    userBadgeInsert: () => {
        queryInterface.bulkInsert('user_badge', [
            {
                count: 3,
                badge_id: 1,
                user_id: 9
            },
            {
                count: 1,
                badge_id: 2,
                user_id: 9
            },
            {
                count: 1,
                badge_id: 3,
                user_id: 9
            },
            {
                count: 1,
                badge_id: 4,
                user_id: 9
            },
            {
                count: 1,
                badge_id: 5,
                user_id: 9
            },
            {
                count: 1,
                badge_id: 6,
                user_id: 9
            },
            {
                count: 1,
                badge_id: 7,
                user_id: 9
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    updateInsert: () => {
        queryInterface.bulkInsert('updates', [
            {
                update_id: 1,
                update_title: 'Update1',
                update_message: 'Update1 message',
                task_id: 1,
                user_id: 1
            },
            {
                update_id: 2,
                update_title: 'Update2',
                update_message: 'Update2 message',
                task_id: 1,
                user_id: 2
            },
            {
                update_id: 3,
                update_title: 'Update3',
                update_message: 'Update3 message Update3 message Update3 message Update3 message Update3 message Update3 message Update3 message Update3 message',
                task_id: 1,
                user_id: 2
            }
        ]).then(() => {
            console.log('success');
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    
}














