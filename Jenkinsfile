pipeline {
    agent any
    
    environment {
        // AWS Configuration
        AWS_REGION = 'us-east-1'  // Change to your region
        ECR_REGISTRY = '765309831951.dkr.ecr.us-east-1.amazonaws.com'  // Replace with your ECR URI
        ECR_REPOSITORY = 'my-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        
        // Application Server Configuration
        APP_SERVER = 'ubuntu@54.159.181.30'  // Replace with your App Server IP
        CONTAINER_NAME = 'my-webapp-container'
        
        // AWS Credentials
        AWS_CREDENTIALS = 'aws-credentials'  // ID of credentials in Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    dockerImage = docker.build("${ECR_REPOSITORY}:${IMAGE_TAG}")
                    docker.build("${ECR_REPOSITORY}:latest")
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                echo '☁️ Pushing Docker image to AWS ECR...'
                script {
                    withAWS(credentials: "${AWS_CREDENTIALS}", region: "${AWS_REGION}") {
                        sh '''
                            # Login to ECR
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                            
                            # Tag images
                            docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}
                            docker tag ${ECR_REPOSITORY}:latest ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
                            
                            # Push images
                            docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}
                            docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                echo '🚀 Deploying to EC2 Application Server...'
                script {
                    withAWS(credentials: "${AWS_CREDENTIALS}", region: "${AWS_REGION}") {
                        sshagent(credentials: ['ec2-ssh-key']) {
                            sh """
                                ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                                    # Login to ECR
                                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                                    
                                    # Stop and remove old container
                                    docker stop ${CONTAINER_NAME} || true
                                    docker rm ${CONTAINER_NAME} || true
                                    
                                    # Pull latest image
                                    docker pull ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
                                    
                                    # Run new container
                                    docker run -d \
                                        --name ${CONTAINER_NAME} \
                                        -p 3000:3000 \
                                        --restart unless-stopped \
                                        ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
                                    
                                    # Verify container is running
                                    docker ps | grep ${CONTAINER_NAME}
                                '
                            """
                        }
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health check...'
                script {
                    sleep(time: 10, unit: 'SECONDS')  // Wait for container to start
                    sshagent(credentials: ['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                                curl -f http://localhost:3000/health || exit 1
                            '
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🌐 Application is live at: http://YOUR_APP_SERVER_IP:3000"
            
            // Send email notification (optional - requires email configuration)
            emailext(
                subject: "✅ Build #${BUILD_NUMBER} - SUCCESS",
                body: """
                    <h2>Build Successful!</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Status:</strong> SUCCESS ✅</p>
                    <p><strong>Application URL:</strong> <a href="http://54.159.181.30:3000">http://54.159.181.30:3000</a></p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <hr>
                    <p>The application has been successfully deployed!</p>
                """,
                to: "lk040904@gmail.com",
                mimeType: 'text/html'
            )
        }
        
        failure {
            echo '❌ Pipeline failed!'
            
            // Send email notification (optional)
            emailext(
                subject: "❌ Build #${BUILD_NUMBER} - FAILED",
                body: """
                    <h2>Build Failed!</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Status:</strong> FAILURE ❌</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                    <hr>
                    <p>Please check the Jenkins logs for more details.</p>
                """,
                to: "lk040904@gmail.com",
                mimeType: 'text/html'
            )
        }
        
        always {
            echo '🧹 Cleaning up...'
            cleanWs()  // Clean workspace
        }
    }
}