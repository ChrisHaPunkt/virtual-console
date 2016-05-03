#!/usr/bin/env bash
case $1 in
    'start' )
        DIR=${PWD##*/}
            if [ DIR != "scripts" ]; then
                     cd `dirname $0`
            fi
        mongod --port 27111 --dbpath ../Database/storage &
        PID=$!
        echo ${PID} > DBPID
        # Restore the data in Database/dumpData in collections named like sub-folders
        # Comment the following line to prevent data restore
       # mongorestore Database/dumpData
        ;;
    'stop')
            DIR=${PWD##*/}
            if [ DIR != "scripts" ]; then
                     cd scripts
            fi
            echo "Stopping MongoDB..."
            kill -INT `cat DBPID`
            echo "" > DBPID
        ;;

    *)
    echo 'usage $0 start | stop'
    ;;

esac