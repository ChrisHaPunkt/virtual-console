#!/usr/bin/env bash
case $1 in
    'start' )

        pkill mongod
        DIR=${PWD##*/}
            if [ DIR != "scripts" ]; then
                     cd "`dirname $0`"
            fi
        cd .. && cd Database && cd storage
        if [  -f mongod.lock ]; then
            pkill mongod
            rm mongod.lock && mongod --port 27111 --dbpath . &
        else
            mongod --port 27111 --dbpath . &
        fi
        PID=$!
        cd .. && cd .. && cd scripts
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


            DBPIDv=`cat DBPID`
            case "$(uname -s)" in

               CYGWIN*|MINGW32*|MINGW64*|MSYS*)
                 echo 'MS Windows'

                 DBPIDv=`ps aux | awk '/mongod/ { print $1}'`
                 echo "Mongo PID ${DBPIDv}"
                 ;;

            esac

            pkill mongod || kill -INT ${DBPIDv}
            echo "" > DBPID
        ;;

    *)
    echo 'usage $0 start | stop'
    ;;

esac
#$SHELL
exit 0
