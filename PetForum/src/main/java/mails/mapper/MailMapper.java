package mails.mapper;

import org.apache.ibatis.annotations.Param;

import mails.model.MailModel;

public interface MailMapper {

	public void sendMail(MailModel mailModel);
	
	public void sendYzm(@Param("userId")int userId,@Param("yzm") String yzm);
	
	public void updateYzm(@Param("userId")int userId,@Param("yzm") String yzm);
	public int getYzmByUserId(@Param("userId")int userId);
}
