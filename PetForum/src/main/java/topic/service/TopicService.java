package topic.service;

import java.util.Map;

import topic.model.TopicModel;

public interface TopicService {

	public Map<String,Object> sendTopic(TopicModel model,String token);
	
	public Map<String,Object> getTopicList(int pageIndex,int pageSize);
	
	public Map<String,Object> getTopicDetail(int id);
	
	public Map<String,Object> getReplayList(int pageIndex,int pageSize,int id);
}
