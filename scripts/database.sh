#!/usr/bin/env bash
case $1 in
    'start' )
        mongod --dbpath ../Database/storage &
        PID=$!
        echo ${PID} > scripts/DBPID
        # Restore the data in Database/dumpData in collections named like sub-folders
        # Comment the following line to prevent data restore
       # mongorestore Database/dumpData
        ;;
    'stop')

            echo "Stopping MongoDB..."
            kill -INT `cat scripts/DBPID`
            echo "" > scripts/DBPID
        ;;

    *)
    echo 'usage $0 start | stop'
    ;;

esac