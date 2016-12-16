package topic.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import topic.model.TopicModel;
import topic.service.TopicService;

@Controller
@RequestMapping("topic")
public class TopicController {

	@Autowired
	private TopicService topicService;
	
	/**
	 * 发布话题
	 * @param model
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/sendTopic",method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object>sendTopic(@RequestBody TopicModel model, HttpServletRequest request,HttpServletResponse response){
		return topicService.sendTopic(model,request.getHeader("token"));
	}
	
	/**
	 * 获取话题
	 * @param model
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getTopicList/paging/{pageIndex}/{pageSize}",method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object>getTopicList(@PathVariable int pageIndex,@PathVariable int pageSize,
			HttpServletRequest request,HttpServletResponse response){
		return topicService.getTopicList(pageIndex,pageSize);
	}
	
	/**
	 * 获取话题详情
	 * @param model
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getTopicDetail/{id}",method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object>getTopicDetail(@PathVariable int id,
			HttpServletRequest request,HttpServletResponse response){
		return topicService.getTopicDetail(id);
	}
	
	/**
	 * 获取评论详情
	 * @param model
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getReplayList/paging/{pageIndex}/{pageSize}/{id}",method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object>getReplayList(@PathVariable int pageIndex,@PathVariable int pageSize,@PathVariable int id,
			HttpServletRequest request,HttpServletResponse response){
		return topicService.getReplayList(pageIndex,pageSize,id);
	}
}
