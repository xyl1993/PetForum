package topic.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import login.mapper.LoginMapper;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import actical.model.ActicalModel;
import summer.base.util.ConstDefine;
import summer.base.util.Pagination;
import summer.core.constant.BusinessError;
import topic.mapper.TopicMapper;
import topic.model.ReplayTopicModel;
import topic.model.TopicModel;
import topic.service.TopicService;

@Service("topicService")
public class TopicServiceImpl implements TopicService {

	@Autowired
	private TopicMapper topicMapper;
	
	@Autowired
	private LoginMapper loginMapper;
	protected static Logger logger = Logger.getLogger("UserService");// 异常信息
	
	public Map<String, Object> sendTopic(TopicModel model, String token) {
		Map<String, Object> respMap = new HashMap<String, Object>();
		try{
			model.setUserId(loginMapper.getUserIdByToken(token));
			topicMapper.sendTopic(model);
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}

	public Map<String, Object> getTopicList(int pageIndex, int pageSize) {
		Map<String,Object> paramsMap = new HashMap<String,Object>();
		Map<String, Object> respMap = new HashMap<String, Object>();
		int rowNum = (pageIndex-1)*pageSize;
		paramsMap.put("rowNum", rowNum);
		paramsMap.put("pageSize", pageSize);
		try{
			List<TopicModel> dataList = topicMapper.getTopicList(paramsMap);
			int count = topicMapper.getCount();
			int pageCount = (count/pageSize)+(count%pageSize==0?0:1);
			Pagination<TopicModel> pagination = new Pagination<TopicModel>(pageIndex, pageSize, pageCount, count, dataList);
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
			respMap.put(ConstDefine.CONST_DATA_KEY, pagination);
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}

	public Map<String, Object> getTopicDetail(int id) {
		Map<String, Object> respMap = new HashMap<String, Object>();
		try{
			TopicModel topicModel = topicMapper.getTopicDetail(id);
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
			respMap.put(ConstDefine.CONST_DATA_KEY, topicModel);
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}

	public Map<String, Object> getReplayList(int pageIndex, int pageSize, int id) {
		Map<String,Object> paramsMap = new HashMap<String,Object>();
		Map<String, Object> respMap = new HashMap<String, Object>();
		int rowNum = (pageIndex-1)*pageSize;
		paramsMap.put("id", id);
		paramsMap.put("rowNum", rowNum);
		paramsMap.put("pageSize", pageSize);
		try{
			List<ReplayTopicModel> dataList = topicMapper.getReplayList(paramsMap);
			int count = topicMapper.getReplayCount(id);
			int pageCount = (count/pageSize)+(count%pageSize==0?0:1);
			Pagination<ReplayTopicModel> pagination = new Pagination<ReplayTopicModel>(pageIndex, pageSize, pageCount, count, dataList);
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
			respMap.put(ConstDefine.CONST_DATA_KEY, pagination);
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}

}
