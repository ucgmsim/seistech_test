pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                echo 'Install dependencies on Jenkins server (maybe unnecessary if test runs inside Docker)'

                sh """
                pwd
                env
                source /var/lib/jenkins/py3env/bin/activate
                cd ${env.WORKSPACE}
                pip install -r requirements.txt
		ssh ec2-user@seistech.nz "cd /home/ec2-user/seistech_psha_frontend/docker/master_test;../Dockerise.sh master_test ${env.ghprbActualCommit}"
                echo ${env.JOB_NAME}
                mkdir -p /tmp/${env.JOB_NAME}
                cd /tmp/${env.JOB_NAME}
                rm -rf qcore
                git clone https://github.com/ucgmsim/qcore.git
                pip install --no-deps ./qcore/
                """
            }
        }
        stage('Run regression tests') {
            steps {
                echo 'Run pytest'
                sh """
                source /var/lib/jenkins/py3env/bin/activate
		whereis chromedriver
                cd ${env.WORKSPACE}
		echo 'Wait for the deployment to be ready'
		sleep 60
		echo 'Testing psha-test deployment'
                pytest -vs
                """
            }
        }
    }

    post {
	
        always {
                echo 'Tear down the environments'
                sh """
		
                rm -rf /tmp/${env.JOB_NAME}/*
                docker container prune -f
		cd ${env.WORKSPACE}
		ssh ec2-user@seistech.nz "docker container prune -f"
		ssh ec2-user@seistech.nz "docker builder prune -f"
		rm -f *.zip
                """
            }
	success {
		echo 'Tear down after success'
		sh """
                source /var/lib/jenkins/py3env/bin/activate
		ssh ec2-user@seistech.nz "cd /home/ec2-user/seistech_psha_frontend/docker/master_test;docker-compose down"
		"""

	}
    }
}
