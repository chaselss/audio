eventTester  =   function(e, callback) {         
	$("#media").get(0).addEventListener(e, function() {
		callback(this);
	});     
}
var singdata;  
var index;
window.onload = function() {
	$.ajax({
		type: "get",
		async: false,
		url: "http://music.qq.com/musicbox/shop/v3/data/hit/hit_newsong.js",
		dataType: "jsonp",
		jsonp: "callback",
		jsonpCallback: "JsonCallback",
		scriptCharset: 'GBK', //设置编码，否则会乱码
		success: function(data) {
			singdata = data.songlist;
			var id = singdata[0].id;
			var src = 'http://ws.stream.qqmusic.qq.com/' + id + '.m4a?fromtag=46'; //准备音乐地址
			
			var pic  = 'http://imgcache.qq.com/music/photo/album_150/15/150_albumpic_131115_0.jpg';//专辑图片
			$(".album_img").css('backgroundImage','url('+pic+')');
			
			$("#media").get(0).src = src;
			$("#media").get(0).statue  = true;
			index = 0;
			$(".name:first").html(singdata[0].songName);
			$(".describe").html(singdata[0].singerName);
			//监听歌曲播放事件
			eventTester("timeupdate", function(media) {

				//进度条改变
				$("#progress").css('width', (media.currentTime / media.duration) * 100 + "%");

			});
			
			//监听歌曲播放完毕事件
			eventTester("ended", function(media) {
					index_play(++index);
			});
			
			var html = template('song_temp', data.songlist);
			$("tbody").html(html);
			tr_addevent($("#media").get(0)); //添加点击事件
		},
		error: function() {
			alert('fail');
		}
	});

	//进度条点击事件
	$("#progress_box").on('click', function(e) {
		var positionx = e.offsetX;
		var width = $(this).width();
		var x = (positionx / width) * 100 + "%";
		$("#progress").css('width', x);
		var currenttime = $("#media").get(0).duration * (positionx / width)
		$("#media").get(0).currentTime = currenttime;

	})
	$(".voc_fa").on('click',function (e) {
		var positiony = e.offsetY;
		if (e.target.offsetParent.className == 'voc_fa') {
			positiony = e.offsetY+e.target.offsetTop;
		}
		var height = $(this).height();
		var y = (1-(positiony / height)) * 100 + "%";
		$(".voc_son").css('height', y);
		$("#media").get(0).volume = 1-positiony / height;
	})
	$("#voc").hover(function () {
		$(".voc_fa").show();
	},function () {
	})
	$(".control_icon .right").on('mouseleave',function () {
		$(".voc_fa").hide();
	})
}

//添加列表点击事件
function tr_addevent(media) {
	$("tbody").on('click', function(e) {
		var e = e || event;
		var target = e.target || e.srcElement;
		if(e.target.nodeName != 'I') {
			var id = e.target.parentNode.id;
			var src = 'http://ws.stream.qqmusic.qq.com/' + id + '.m4a?fromtag=46'; //准备音乐地址
		/*			
  			var image_id = e.target.parentNode.className;
			var pic  = 'http://imgcache.qq.com/music/photo/album_150/'+image_id%100+'/150_albumpic_'+image_id+'_0.jpg';//专辑图片
			$(".album_img").css('backgroundImage','url('+pic+')');*/
			
			media.src = src;
			index = $(e.target.parentNode).index();
			$("#media").get(0).currentTime = 0;
			$("#progress").css('width', 0);
			//监听歌曲播放事件
			eventTester("timeupdate", function(media) {

				//进度条改变
				$("#progress").css('width', (media.currentTime / media.duration) * 100 + "%");

			});

			$(".name:first").html(e.target.parentNode.children[2].innerHTML);
			$(".describe").html(e.target.parentNode.children[3].innerHTML);
			
			//重置样式
			$("#media").get(0).statue = true;
			$('.control_icon').find('.left').children()[1].innerHTML = '&#xe62d';
		}
	})

	//control元素的点击
	$('.control_icon').on('click', function(e) {
		var e = e || event;
		var target = e.target || e.srcElement;
		switch(e.target.id) {
			case 'pre':
				index==0?"":index_play(--index);
				break;
			case 'paly':
				play(e.target);
				break;
			case 'next':
				index_play(++index);
				break;
			case 'random':
				index = Math.floor(Math.random()*100);
				index_play(index);
				break;
			case 'refesh':
				$("#media").get(0).currentTime = 0;
				$("#progress").css('width', 0);
				break;
			case 'voc':
				voc();
				break;
			default:
				break;
		}
	})
	function voc () {
		if ($("#media").get(0).ismuted) {			//之前是静音
			$("#media").get(0).muted = 0;			//开声音
			$("#voc").html('&#xe637;')
			$("#media").get(0).ismuted = false;		//设置非静音状态
		}else{
			$("#media").get(0).muted = 1;
			$("#voc").html('&#xe635;');
			$("#media").get(0).ismuted = true;
		}
	}
	
	function play(ele) {
		
		if($("#media").get(0).statue) {
			media.pause();
			$("#media").get(0).statue = false;
			ele.innerHTML = '&#xe62e';
			var matrix = $(".disc:first").css('transform');
			console.log($(".disc:first").css('transform'));
			$(".disc:first").removeClass('paly').siblings().removeClass('disc_head_play');
			$(".disc:first").css('transform',matrix);
		} else {
			media.play();
			$("#media").get(0).statue = true;
			ele.innerHTML = '&#xe62d';
			$(".disc").addClass('paly').siblings().addClass('disc_head_play');
		}

	}
}

function index_play(i) {
	var id = singdata[i].id;
	var src = 'http://ws.stream.qqmusic.qq.com/' + id + '.m4a?fromtag=46'; //准备音乐地址
	
	$("#media").get(0).src = src;
	$(".name:first").html(singdata[i].songName);
	$(".describe").html(singdata[i].singerName);
	$("#media").get(0).statue = true;
	$('.control_icon').find('.left').children()[1].innerHTML = '&#xe62d';
	$("#paly").get(0).innerHTML = '&#xe62d';
	$(".disc").addClass('paly').siblings().addClass('disc_head_play');
	//监听歌曲播放事件
	eventTester("timeupdate", function(media) {
		//进度条改变
		$("#progress").css('width', (media.currentTime / media.duration) * 100 + "%");
	});
	media.play();
		
	
}