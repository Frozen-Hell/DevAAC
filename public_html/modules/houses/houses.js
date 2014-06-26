// Module Route(s)
DevAAC.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/houses', {
        templateUrl: PageUrl('houses'),
        controller: 'HousesController'
    });
    $routeProvider.when('/houses/:id', {
        templateUrl: PageUrl('houses/house'),
        controller: 'HouseController'
    });
}]);

// Module Controller(s)
DevAAC.controller('HouseController', ['$scope', 'House', 'Player', '$routeParams', '$location',
    function($scope, House, Player, $routeParams, $location) {
        House.get({houseId: $routeParams.id}, function(house) {
            $scope.house = house;
            if (house.owner > 0) {
                $scope.player = {
                    name: 'Loading...'
                }
                Player.get({id:house.owner}, function(player) {
                    $scope.player.name = player.name;
                }, function(response) {
                    if (response.status === 404) {
                        $scope.player = {
                            name: '[Deleted Player]'
                        }
                    }
                });
            }
        }, function (response) {
            if (response.status === 404) {
                $location.path('/houses');
            }
        });
    }
]);

DevAAC.controller('HousesController', ['$scope', 'House', 'Player',
    function($scope, House, Player) {
        $scope.houses = House.query(function(){
            $scope.loaded = true;
        });

        $scope.order = 'size';
        $scope.orderReverse = true;
        $scope.players = [];

        $scope.player = function(id) {
            if(id == 0)
                return;

            if($scope.players[id] == undefined)
                $scope.players[id] = Player.get({id: id});

            return $scope.players[id];
        }
    }
]);

// Module Factories(s)
DevAAC.factory('House', ['$resource',
    function($resource){
        return $resource(ApiUrl('houses/:houseId'), {}, {
            get: { cache: true },
            query: { isArray: true, cache: true }
        });
    }
]);