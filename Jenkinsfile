pipeline {
    agent any

    stages {
        stage("Checkout Git repository") {
            steps {
                echo 'Pulling '
                git branch: 'master', url: 'https://github.com/aymeennefzi/HR_Managment_application_Backend-.git'
            }
            post {
                success {
                    echo "Cloning successful..."
                }
                failure {
                    echo "Cloning failed! See log for details. Terminating..."
                }
            }
        }
        stage('Install dependencies') {
            steps {
                script {
                    sh('npm install')
                }
            }
        }
        stage('Unit Test skiped') {
            when {
                expression { false }
            }
            steps {
                echo "Skipping unit test..."
            }
        }
        stage('Build application') {
            steps {
                script {
                    sh('npm run build')
                }
            }
        }
    }
}
