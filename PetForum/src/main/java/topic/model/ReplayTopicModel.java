package topic.model;

import java.util.Date;

public class ReplayTopicModel implements java.io.Serializable{

	private static final long serialVersionUID = -5003962321527605329L;

	private int id;
	
	private Date replayTime;
	
	private String content;
	
	private String userName;
	
	private String headUrl;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getReplayTime() {
		return replayTime;
	}

	public void setReplayTime(Date replayTime) {
		this.replayTime = replayTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getHeadUrl() {
		return headUrl;
	}

	public void setHeadUrl(String headUrl) {
		this.headUrl = headUrl;
	}
	

}
