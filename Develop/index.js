const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const teamList =[]

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
async function run() {

    let initial = await inquirer.prompt([
        {
            type: `input`,
            message: "How many employees are on your team?",
            name: 'amount'
        }
    ])
    var b = parseInt(initial.amount)
    if (Number.isInteger(b) === true) {
        for (let i = 0; i < initial.amount; i++) {
            let personName = await inquirer.prompt([
                {
                    type: `input`,
                    message: `What is Employee #${i + 1}'s name?`,
                    name: `name`
                }
            ])
            let personInfo = await inquirer.prompt([
                {
                    type: `list`,
                    message: `What role does ${personName.name} have?`,
                    choices: ['Manager', `Engineer`, `Intern`],
                    name: `role`
                },
                {
                    type: `input`,
                    message: `What is ${personName.name}'s ID?`,
                    name: `id`
                },
                {
                    type: `input`,
                    message: `What is ${personName.name}'s Email?`,
                    name: `email`
                },
            ])
            switch (personInfo.role) {
                case "Manager":
                    let officeData = await inquirer.prompt([
                        {
                            message: `What is ${personName.name}'s office number?`,
                            type: `input`,
                            name: `officeNumber`
                        }
                    ])
                    teamList.push(new Manager(personName.name, personInfo.id, personInfo.email, officeData.officeNumber))
                    break
                case "Engineer":
                    let githubData = await inquirer.prompt([
                        {
                            message: `What is ${personName.name}'s github username?`,
                            type: `input`,
                            name: `github`
                        }
                    ])
                    teamList.push(new Engineer(personName.name, personInfo.id, personInfo.email, githubData.github))
                    break
                case "Intern":
                    let schoolData = await inquirer.prompt([
                        {
                            message: `What is ${personName.name}'s school?`,
                            type: `input`,
                            name: `school`
                        }
                    ])
                    teamList.push(new Intern(personName.name, personInfo.id, personInfo.email, schoolData.school))
                    break
            }
        }
    } else {
        console.log("Please enter an integer")
        run()
    }
}

async function build(){
    await run()
    let htmlFile = render(teamList)
    fs.writeFileSync(outputPath, htmlFile)
}

build()
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
