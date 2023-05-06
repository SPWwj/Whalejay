

const userLanguage = navigator.language || navigator["language"] || "en";

const getMessage = (english: string, chinese: string): string => {
    return userLanguage.startsWith("en") ? english : chinese;
};

export const AWAKING_START_NOTICE = getMessage(
    "Waking up... Please wait for the avatar to change~",
    "正在唤醒中...请等候头像变化~"
);

export const AWAKED_NOTICE = getMessage(
    "I'm awake now, what's up?",
    "我睡醒了，有什么事吗?"
);

export const AWAKING_INPROGRESS_NOTICE = getMessage(
    "I'm awake now, what's up?",
    "我睡醒了，有什么事吗?"
);

export const AWAKED_TO_RESPOND_NOTICE = getMessage(
    "Ah, I've been poked awake~",
    "啊被戳醒了~"
);