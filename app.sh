#!/usr/bin/env bash

case $1 in
    'start' )
            DIR=${PWD##*/}
            echo `dirname $0`
            if [ ${DIR} != "virtual-console" ]; then
                     cd "`dirname $0`"
            fi
            cd scripts
            if [ "$(cat DBPID)" != "" ]; then

                if  kill -s 0 `cat DBPID`; then
                    echo "DB already running."
                else
                    echo "No DB running"
                    echo "" > DBPID
                    pkill mongod
                    bash database.sh start
                fi
            else
                bash database.sh start
            fi
            cd ..
            DIR="NodeServer/node_modules"

            if [ "$(ls -A ${DIR})" ]; then
                 echo " NodeModules present, starting app.."
            else
                echo "Prepare nodejs dependencies..."
                 bash scripts/prepareDeps.sh
            fi

            if [ "$(cat scripts/NODEPID)" != "" ]; then

                if  kill -s 0 `cat scripts/NODEPID`; then
                    echo "Node already running. Restarting"
                    echo "Stopping NodeJS..."
                    kill -INT `cat scripts/NODEPID`
                    echo "" > scripts/NODEPID

                fi

            fi

            node NodeServer/bin/www &
            PID=$!
            echo ${PID} > scripts/NODEPID

         #   $SHELL
        ;;
    'stop')
            bash scripts/database.sh stop

            echo "Stopping NodeJS..."
            kill -INT `cat scripts/NODEPID`
            echo "" > scripts/NODEPID
        ;;
    'prepDeps')
           echo "Prepare nodejs dependencies..."
           bash scripts/prepareDeps.sh
        ;;

    *)
    echo 'usage $0 start | stop | prepDeps'
    ;;

esac
exit