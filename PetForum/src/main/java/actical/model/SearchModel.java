package actical.model;

public class SearchModel {

	private String searchText;

	private int userId;
	
	private String tag;
	
	private int invitationId;
	
	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getInvitationId() {
		return invitationId;
	}

	public void setInvitationId(int invitationId) {
		this.invitationId = invitationId;
	}

	public String getSearchText() {
		return searchText;
	}

	public void setSearchText(String searchText) {
		this.searchText = searchText;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}
}
