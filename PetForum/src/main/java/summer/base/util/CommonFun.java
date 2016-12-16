/**
 * 系统名称：共通方法
 * 
 * 功能概要：共通方法的定义和实现
 * 
 * 备注:无
 * 
 * 版本履历 日期：2013/10/10 所属：如云 修改人：王剑 修改概要：初版作成
 */
package summer.base.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class CommonFun {

	/**
	 * 取得request中的数据
	 * 
	 * @param request
	 *            请求
	 * @return request中的数据
	 */
	public static Map<String, Object> getParamsMap(HttpServletRequest request) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		Enumeration<String> pNames = request.getParameterNames();
		while (pNames.hasMoreElements()) {
			String pName = pNames.nextElement();
			paramMap.put(pName, request.getParameter(pName));
		}
		return paramMap;
	}

	
	/**
	 * 为数据生成主键
	 * @param value
	 * @return
	 */
	public static String getRandomNo(String value){
		String temp = "1234567890";
		String randomNo=value.length()>7?value.substring(0, 7):value;
		for (int i = 0; i < 15; i++) {
			randomNo += temp.charAt((int) Math.floor(Math.random() * temp.length()));
		}
		return randomNo;
		
	}
	
	/** 
     * 两个时间之间相差距离多少天 
     * @param one 时间参数 1： 
     * @param two 时间参数 2： 
     * @return 相差天数 
     */  
    public static long getDistanceDays(String str1, String str2) throws Exception{  
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");  
        Date one;  
        Date two;  
        long days=0;  
        try {  
            one = df.parse(str1);  
            two = df.parse(str2);  
            long time1 = one.getTime();  
            long time2 = two.getTime();  
            long diff ;  
            if(time1<time2) {  
                diff = time2 - time1;  
            } else {  
                diff = time1 - time2;  
            }  
            days = diff / (1000 * 60 * 60 * 24);  
        } catch (ParseException e) {  
            e.printStackTrace();  
        }  
        return days;  
    }  
    /** 
     * 两个时间相差距离多少天多少小时多少分多少秒 
     * @param str1 时间参数 1 格式：1990-01-01 12:00:00 
     * @param str2 时间参数 2 格式：2009-01-01 12:00:00 
     * @return long[] 返回值为：{天, 时, 分, 秒} 
     */  
    public static long[] getDistanceTimes(Date str1, Date str2) {
        long day = 0;  
        long hour = 0;  
        long min = 0;  
        long sec = 0;  
        long time1 = str1.getTime();  
		long time2 = str2.getTime();  
		long diff ;  
		if(time1<time2) {  
		    diff = time2 - time1;  
		} else {  
		    diff = time1 - time2;  
		}  
		day = diff / (24 * 60 * 60 * 1000);  
		hour = (diff / (60 * 60 * 1000) - day * 24);  
		min = ((diff / (60 * 1000)) - day * 24 * 60 - hour * 60);  
		sec = (diff/1000-day*24*60*60-hour*60*60-min*60);  
        long[] times = {day, hour, min, sec};  
        return times;  
    } 
}