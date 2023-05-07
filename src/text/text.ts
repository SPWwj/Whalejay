

const userLanguage = navigator.language || navigator["language"] || "en";

const getMessage = (english: string, chinese: string): string => {
    return userLanguage.startsWith("en") ? english : chinese;
};

export const AWAKING_START_NOTICE = getMessage(
    'Waking up...<br/><br/>Please wait while I wake up and change my avatar.<br/><br/><span class="command">/image {keyword}</span> to generate an image.',
    '正在唤醒中...<br/><br/>请等待我醒来并更换头像。<br/><br/><span class="command">/image {关键词}</span> 生成图片。'
);

export const AWAKED_NOTICE = getMessage(
    "I'm awake now. What can I help you with?",
    "我醒了。有什么可以帮到你的吗？"
);

export const AWAKING_INPROGRESS_NOTICE = getMessage(
    'I am already waking up. Please wait a moment.',
    '我正在唤醒中，请稍等片刻。'
);

export const AWAKED_TO_RESPOND_NOTICE = getMessage(
    "Ah, I've been poked awake. How may I assist you?",
    '啊，被戳醒了。有什么需要帮忙的吗？'
);