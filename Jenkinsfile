pipeline {
    agent any
    environment {
        DB_HOST = '192.168.254.133'
        DB_USER = 'appserver'
        DB_PASS = 'pass@123'
        DB_NAME = 'appdb'
    }
    stages {
        stage('Clone Repository') {
            steps {
                // Clean workspace and clone the latest code from GitHub
                deleteDir()
                git branch: 'main', url: 'https://github.com/kanhu1997/3tier.git'
            }
        }
        stage('Check Database Connection') {
            steps {
                sh '''
                echo "Checking PostgreSQL connection..."
                PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\\q"
                '''
            }
        }
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
