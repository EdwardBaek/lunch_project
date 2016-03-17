angular.module('factoryTest',[])
.factory('appData',
	function appData(){
		var dataArray = [];
		return {
			getData : function(idx){
				if(idx)
					return dataArray[idx];
				else
					return dataArray;
			},
			insertData : function(data){
				dataArray.push(data);
			},
			deleteData : function(idx){
				delete dataArray[idx];
			}
		}
	}
)