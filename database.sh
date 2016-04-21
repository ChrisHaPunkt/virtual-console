#!/usr/bin/env bash
case $1 in
    'start' )
        mongod --dbpath Database/storage

        # Restore the data in Database/dumpData in collections named like sub-folders
        # Comment the following line to prevent data restore
        mongorestore Database\dumpData
        ;;
    'stop')
                #  mongod --shutdown funktioniert nicht
        ;;

    *)
    echo 'usage $0 start | stop'
    ;;

esac