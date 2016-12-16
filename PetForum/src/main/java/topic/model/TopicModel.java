package topic.model;

import java.util.Date;


public class TopicModel implements java.io.Serializable {

	private static final long serialVersionUID = 1112285753227070734L;

	private int id;
	
	private String content;
	
	private Date createTime;
	
	private int userId;
	
	private String userName;
	
	private int count;
	
	private Date lastReplayTime;
	
	private String headUrl;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Date getLastReplayTime() {
		return lastReplayTime;
	}

	public void setLastReplayTime(Date lastReplayTime) {
		this.lastReplayTime = lastReplayTime;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public String getHeadUrl() {
		return headUrl;
	}

	public void setHeadUrl(String headUrl) {
		this.headUrl = headUrl;
	}
	
	
}
