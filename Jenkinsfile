pipeline {
    agent any
    environment {
        DB_HOST = '192.168.254.1333'
        DB_USER = 'your_db_user'
        DB_PASS = 'your_db_password'
        DB_NAME = 'your_db_name'
    }
    stages {
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t frontend-app .'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t backend-app .'
                }
            }
        }
        stage('Run Containers') {
            steps {
                sh 'docker rm -f frontend-app || true'
                sh 'docker rm -f backend-app || true'
                sh 'docker run -d --name frontend-app -p 80:80 frontend-app'
                sh 'docker run -d --name backend-app -p 5000:5000 -e DB_HOST=$DB_HOST -e DB_USER=$DB_USER -e DB_PASS=$DB_PASS -e DB_NAME=$DB_NAME backend-app'
            }
        }
    }
}
