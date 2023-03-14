pipeline {
    agent any
    stages{
        stage("Clean the folder"){
            steps{
                cleanWs()
            }
        }
        stage("Checkout"){
            steps{
                git branch: 'main' , url:'https://github.com/EyabKabha/todolistclient.git'
            }
        }
        stage("Download node moudles"){
            steps{
                bat 'npm install'
            }
        }
        stage("Cleaning the cache"){
            steps{
                bat 'npm cache clean --force'
            }
        }
        stage("Build"){
            steps{
                bat 'npm run build'
            }
        }
    }
}
