package topic.mapper;

import java.util.List;
import java.util.Map;

import topic.model.ReplayTopicModel;
import topic.model.TopicModel;

public interface TopicMapper {

	public void sendTopic(TopicModel topicModel);
	
	public List<TopicModel> getTopicList(Map<String,Object> paramsMap);
	
	public List<ReplayTopicModel> getReplayList(Map<String,Object> paramsMap);
	
	public TopicModel getTopicDetail(int id);
	
	public int getCount();
	
	public int getReplayCount(int id);
}
