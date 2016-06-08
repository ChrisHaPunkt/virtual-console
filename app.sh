#!/usr/bin/env bash

case $1 in
    'start' )
            DIR=${PWD##*/}
            if [ DIR != "virtual-console" ]; then
                     cd `dirname $0`
            fi
            if [ "$(cat scripts/DBPID)" != "" ]; then

                if  kill -s 0 `cat scripts/DBPID`; then
                    echo "DB already running."
                else
                    echo "No DB running"
                    echo "" > scripts/DBPID
                    bash scripts/database.sh start
                fi
            else
                bash scripts/database.sh start
            fi

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