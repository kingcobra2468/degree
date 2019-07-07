#install node

declare -gr PACKAGES=("node" "npm")

function package_exists() {
    
    echo $(dpkg -l | tr -s [:blank:] | cut -f 2 -d ' ' | grep -Ec "^$1$")
}

function common_setup() {

    for package in $PACKAGES; do
        sudo apt-get install $package
    done

}

function private_task_setup() {
    
    if [[ $(echo $1 | grep -icE "RaspPi") -eq 1 ]]; then
        
        pushd ./RaspPiThermometer/PrivateRasPi/Rasp_Node
    elif [[ $(echo $1 | grep -icE "Middleware") -eq 1 ]]; then
        
        pushd ./RaspPiThermometer/PrivateRasPi/MiddleWare
    else 
        >&2 echo "Invalid Input $1"
    fi

    npm install
    echo "@reboot /usr/bin/nodejs $PWD/index.js &" > /tmp/tempcron
    crontab /tmp/tempcron
    rm /tmp/tempcron
   
}

function public_task_setup() {
    
    pushd ./RaspPiThermometer/PublicRasPi
    npm install
    echo "@reboot /usr/bin/nodejs $PWD/index.js &" > /tmp/tempcron
    crontab /tmp/tempcron
    rm /tmp/tempcron

}

echo -n "What type of Rasberry Pi setup are you setting up (Private/Public): "

read type_of_installation

if [ $(echo $type_of_installation | grep -icE "^[[p]((ublic)|(rivate))$") -eq 1 ]; then
    
    common_setup

    case $type_of_installation in 

        private)

            echo -n "Are you setting up a Rasp Pi or Middleware (RaspPi/Middleware): "
            read type_of_private_installation
            private_task_setup $type_of_private_installation
        ;;
        public)

            public_task_setup
        ;;
        *)
            >&2 echo "Invalid Input $type_of_installation"
            exit 1
        ;;
    esac

else
    >&2 echo "Invalid Input $type_of_installation"
    exit 1
fi

echo "Do you want to reboot now?(Yes/No)"
read choice

echo "Setup Complete"
sleep 1

if [[ $(echo $1 | grep -icE "yes") -eq 1 ]]; then
    shutdown -R now
fi