#!/usr/bin/env node

import chalk from "chalk";
import axios from "axios";
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalkAnimation from 'chalk-animation'
import figlet from "figlet";
import {createSpinner} from 'nanospinner';


const apiKey = '4DPRRt4GAVSe2JPA2InFp05Puamd9tSG4wON9dLm';
const apiUrl = 'https://quizapi.io/api/v1/questions';

const simplifiedQuestions = [];
async function convertQuestionFormat(question) {
  const options = Object.keys(question.answers).filter(key => question.answers[key] !== null);
  const correctAnswer = question.correct_answer;
  return {
    question: question.question,
    options: options.map(option => question.answers[option]),
    correctAnswer: question.answers[correctAnswer]
  };
}
async function fetchData() {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        apiKey: apiKey,
        difficulty: 'Easy', // Set the difficulty level
        limit: 15, // Set the number of questions to fetch
      },
    });

    for (let i = 0; i < response.data.length; i++) {
      simplifiedQuestions.push(await convertQuestionFormat(response.data[i]));
    }

  } catch (error) {
    console.error('Error making API request:', error.message);
    process.exit(1);
  }
}
// Call the async function
await fetchData();
  

let plyerName;

const sleep = (ms= 2000)=> new Promise((r)=> setTimeout(r,ms));
const sleepUntill = (ms= 10000)=> new Promise((r)=> setTimeout(r,ms));

async function welcome(){
    const rainbowTitle = chalkAnimation.rainbow(
        "Welcome Nerds" 
    );
    await sleep();
    rainbowTitle.stop();

    console.log(`
        ${chalk.bgBlue("How to Play")}
        Welcome to the Quiz Show! 
        Get ready to be the brainiac hero of the hour. 
        Nail those answers, or I might just turn into a digital ghost 👻
        –no pressure, just fun and frolic!
    `)
}

async function askName() {

    await inquirer.prompt([
    {
      name: 'player_name',
      message: 'I can call you?',
      default: 'null'
    },
  ])
  .then(answers => {
    plyerName= answers.player_name;
  });
}

async function  askQuestion(question,option, res){
    const answer = await inquirer.prompt({
        name: `name`,
        type: 'list',
        message: question+'\n',
        choices: option,
    });

    return handleAnswer( answer.name == res );
}

async function handleAnswer(isCorrect){
    const spinner = createSpinner('Checking answer...').start();
    await sleep();

    if(isCorrect){
        spinner.success({text:`Nice Work ${plyerName}.`});
    }else{
        spinner.error({text:`Sorry ${plyerName}, YOU LOSE ☠️  ☠️`})
        process.exit(1);
    }
}

async function winner() {
    console.clear();
    figlet(`Congrats , ${plyerName} !\n Winner`, (err, data) => {
      console.log(gradient.pastel.multiline(data) + '\n');
      console.log(`     You have won this game See you next time`);
      console.log(chalk.green(`     Programming isn't about what you know; it's about making the command line look cool`));
      console.log(`\n     I guess the delay is too long you may press ^C `);
      sleepUntill();      
    });
}

await welcome();
await askName();
let score = 0;
console.log(simplifiedQuestions);
for(let i=0;i<simplifiedQuestions.length;i++){
    if(simplifiedQuestions[i].correctAnswer  == undefined)  continue;
    await askQuestion(simplifiedQuestions[i].question,simplifiedQuestions[i].options, simplifiedQuestions[i].correctAnswer);
    score++;
    if(score == 5)
        break;
}
await winner();

