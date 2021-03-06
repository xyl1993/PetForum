package testMybatis;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import login.model.UserInfo;
import login.service.LoginService;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alibaba.fastjson.JSON;


@RunWith(SpringJUnit4ClassRunner.class)     //表示继承了SpringJUnit4ClassRunner类  
@ContextConfiguration(locations = {"classpath:spring-mybatis.xml"})  
public class TestMyBatis {

	 private static Logger logger = Logger.getLogger(TestMyBatis.class);  
	//  private ApplicationContext ac = null;  
	    @Resource  
	    private LoginService loginService = null; 
	  
	//  @Before  
	//  public void before() {  
//	      ac = new ClassPathXmlApplicationContext("applicationContext.xml");  
//	      userService = (IUserService) ac.getBean("userService");  
	//  }  
	  
	    @Test  
	    public void test1() {  
	    	Random random = new Random();
	        String result="";
			for(int i=0;i<6;i++){
			 result+=random.nextInt(10);
			}
	        logger.info(JSON.toJSONString(result));  
	    }  
	    
//	    @Test  
//	    public void test2() {  
//	    	Map<String, Object> paramsMap = new HashMap<String, Object>();
//	    	paramsMap.put("id", "0");
//	    	Map<String,Object> respMap = moduleService.getModuleList(paramsMap);
//	        logger.info(JSON.toJSONString(respMap.get("data")));  
//	    }  
	    
//	    @Test  
//	    public void test3() {  
//	    	Map<String, Object> paramsMap = new HashMap<String, Object>();
//	    	paramsMap.put("id", "0");
//	    	Map<String,Object> respMap = moduleService.getModuleListByPid("0");
//	        logger.info(JSON.toJSONString(respMap.get("data")));  
//	    }
	    
	    //me service test start
//	    @Test  
//	    public void testMe() {  
//	    	DateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
//	    	MeModel meModel = new MeModel();
//	    	meModel.setId("1234567788");
//	    	meModel.setName("测试");
//	    	try {
//				meModel.setBirthday(format1.parse("2015-6-7"));
//			} catch (ParseException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	    	meModel.setCity("南通");
//	    	meModel.setTel("18306271627");
//	    	meModel.setEmail("602165057@qq.com");
//	    	meModel.setBlog("https://nodeblog-xylblog.rhcloud.com/");
//	    	meModel.setDescription("性格开朗，善于沟通;较强的逻辑思维和自学能力;对待工作认真、负责;具有强烈责任感;");
//	    	meService.save(meModel);
//	    	Map<String,Object> respMap = meService.getMeList();
//	        logger.info(JSON.toJSONString(respMap.get("data")));  
//	        meService.delete(meModel.getId());
//	    }
	  //me service test end
//	  @Test
//	  public void testLogin(){
//		  UserModel userModel = new UserModel();
//		  userModel.setUserName("111");
//		  userModel.setPassword("96e79218965eb72c92a549dda330112");
//		  Map<String,Object> respMap = userService2.login(userModel);
//		  logger.info(JSON.toJSONString(respMap.get("message")));  
//	  }
		  @Test
		  public void testUpdatePassWordInApp(){
			  UserInfo userModel = new UserInfo();
			  userModel.setId(1);
			  userModel.setYzm("137572");
			  userModel.setToken("VcLHmkrRLhTHRdga1ehGxTW7PX0=");
			  userModel.setNewPassword("96e79218965eb72c92a549dd5a330112");
			  Map<String,Object> respMap = loginService.updatePassWordInApp(userModel,"VcLHmkrRLhTHRdga1ehGxTW7PX0=");
			  logger.info(JSON.toJSONString(respMap.get("message")));  
		  }
}
