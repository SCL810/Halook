/*
 * Copyright (c) 2004-2010 SMG Co., Ltd. All Rights Reserved.
 * Please read the associated COPYRIGHTS file for more details.
 *
 * THE  SOFTWARE IS  PROVIDED BY  SMG Co., Ltd., WITHOUT  WARRANTY  OF
 * ANY KIND,  EXPRESS  OR IMPLIED,  INCLUDING BUT  NOT LIMITED  TO THE
 * WARRANTIES OF  MERCHANTABILITY,  FITNESS FOR A  PARTICULAR  PURPOSE
 * AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDER BE LIABLE FOR ANY
 * CLAIM, DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING
 * OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 */
package jp.co.acroquest.endosnipe.web.dashboard.service.processor;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.acroquest.endosnipe.web.dashboard.config.AlarmSetting;
import jp.co.acroquest.endosnipe.web.dashboard.constants.EventConstants;
import jp.co.acroquest.endosnipe.web.dashboard.constants.LogMessageCodes;
import jp.co.acroquest.endosnipe.web.dashboard.manager.EventManager;
import jp.co.acroquest.endosnipe.web.dashboard.util.EventUtil;
import jp.co.acroquest.endosnipe.web.dashboard.util.RequestUtil;
import jp.co.smg.endosnipe.common.logger.ENdoSnipeLogger;

/**
 * パフォーマンスドクターの警告の通知開始要求を処理するクラスです。
 * @author fujii
 *
 */
public class AlarmNotifyStartProcessor implements EventProcessor
{
    /** ロガー */
    private static final ENdoSnipeLogger LOGGER =
                                                  ENdoSnipeLogger.getLogger(AlarmNotifyStartProcessor.class);

    /**
     * {@inheritDoc}
     */
    public void process(HttpServletRequest request, HttpServletResponse response)
    {
        String agentIds = request.getParameter(EventConstants.AGENT_IDS);
        String clientId = request.getParameter(EventConstants.CLIENT_ID);
        String alarmLevelStr = request.getParameter(EventConstants.ALARM_LEVEL);

        if (agentIds == null)
        {
            LOGGER.log(LogMessageCodes.UNKNOWN_AGENT_ID);
            return;
        }
        if (clientId == null)
        {
            LOGGER.log(LogMessageCodes.NO_CLIENT_ID);
            return;
        }

        List<Integer> agentIdList = RequestUtil.getAgentIdList(agentIds);
        if (agentIdList == null || agentIdList.size() == 0)
        {
            LOGGER.log(LogMessageCodes.UNKNOWN_AGENT_ID, agentIds);
            return;
        }
        int alarmLevel = EventUtil.getAlarmLevel(alarmLevelStr);

        EventManager manager = EventManager.getInstance();

        AlarmSetting setting = manager.getAlarmSetting(clientId);
        if (setting == null)
        {
            setting = new AlarmSetting();
            manager.addAlarmSetting(clientId, setting);
        }
        setting.setAlarmLevel(alarmLevel);

        // 計測項目を追加します。
        for (Integer agentId : agentIdList)
        {
            setting.addAgent(agentId);
            setting.setNotify(true);
        }
    }

}
