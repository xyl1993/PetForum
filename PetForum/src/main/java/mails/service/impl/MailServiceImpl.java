package mails.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import summer.base.util.ConstDefine;
import summer.base.util.SendmailUtil;
import summer.core.constant.BusinessError;
import login.mapper.LoginMapper;
import mails.mapper.MailMapper;
import mails.model.MailModel;
import mails.service.MailService;

@Service
public class MailServiceImpl implements MailService {

	protected static Logger logger = Logger.getLogger("login");// 异常信息
	
	@Autowired
	private MailMapper mailMapper;
	@Autowired
	private LoginMapper loginMapper;
	
	public Map<String,Object> sendMail(MailModel mailModel) {

		Map<String,Object> respMap = new HashMap<String, Object>();
		try{
			mailMapper.sendMail(mailModel);
			//发送邮件给我自己
			SendmailUtil se = new SendmailUtil();
	        String text = "标题:"+mailModel.getTitle()+"</br>";
	        text = text+"发件人:"+mailModel.getEmail()+"</br>";
	        text = text + "内容:"+mailModel.getText();
	        se.doSendHtmlEmail("意见反馈", text, "602165057@qq.com");
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}

	public Map<String, Object> forgetMm(MailModel mailModel) {
		Map<String,Object> respMap = new HashMap<String, Object>();
		String newPass = ConstDefine.getRandomNumber();
		try{
			int count = loginMapper.selectOne(mailModel.getEmail());
			if(count==0){
				respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
				respMap.put(ConstDefine.CONST_MESSAGE_KEY, "当前邮箱不存在，请确认帐号的邮箱地址");
			}else{
				loginMapper.updateMd5PassWord(mailModel.getEmail(), newPass);
				//发送邮件给我自己
				SendmailUtil se = new SendmailUtil();
		        String text = "您的密码已经重置,请登录之后重新修改密码</br>新密码为:";
		        text = text+newPass;
		        se.doSendHtmlEmail("您的密码已经重置", text, mailModel.getEmail());
				respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
			}
			
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}
	
	public Map<String, Object> updateMmInApp(MailModel mailModel) {
		Map<String,Object> respMap = new HashMap<String, Object>();
		String yzm = ConstDefine.getRandomNumber();
		try{
			int count = mailMapper.getYzmByUserId(mailModel.getUserId());
			if(count==0){
				//没有验证码，插入
				mailMapper.sendYzm(mailModel.getUserId(),yzm);
			}else{
				mailMapper.updateYzm(mailModel.getUserId(),yzm);
				//发送邮件给我自己
				SendmailUtil se = new SendmailUtil();
		        String text = "您验证码为:";
		        text = text+yzm;
		        se.doSendHtmlEmail("您的验证码", text, mailModel.getEmail());
			}
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, true);
		}catch(Exception e){
			logger.error(e.getMessage());
			respMap.put(ConstDefine.CONST_SUCCESS_KEY, false);
			respMap.put(ConstDefine.CONST_MESSAGE_KEY, BusinessError.SERVELT_ERROR);
		}
		return respMap;
	}

}
