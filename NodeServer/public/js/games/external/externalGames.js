/**
 * Created by hannes on 18.04.2016.
 */
define(['jquery', 'gameApi'], function ($, gameApi) {

        // Constructor
        function ExternalGames(){}

        ExternalGames.prototype.setSelectedGame = function(gameId){
            this.gameId = gameId;
            console.log('Selected game is: ' + this.gameId);
        };

        // return public interface of the require module
        return ExternalGames;
    }
);