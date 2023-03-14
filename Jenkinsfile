pipeline {
    agent any
    stages{
        // stage("Clean the folder"){
        //     steps{
        //         cleanWs()
        //     }
        // }
        // stage("Checkout"){
        //     steps{
        //         git branch: 'main' , url:'https://github.com/EyabKabha/todolistclient.git'
        //     }
        // }
        stage("Download node moudles"){
            steps{
                bat 'npm install'
            }
        }
        // stage("Cleaning the cache"){
        //     steps{
        //         bat 'npm cache clean --force'
        //     }
        // }
        stage("Build 2"){
            steps{
                bat 'npm run build'
            }
        }
        stage('Deployment') {
	        steps {
	      		// Create an Approval Button with a timeout of 15minutes.
	                timeout(time: 15, unit: "MINUTES") {
	                    input message: 'Do you want to approve the deployment?', ok: 'Yes'
	                }
	                echo "Initiating deployment"
	        }
	    }

	}
}

