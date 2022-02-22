export type Content = {
  title: string;
  text: string;
  details: {title: string; link: string;}[];
  estimate: number;
  plans: string[];
  clear: boolean[];
  id: string;
}

export const userToContent = (plan: string | undefined | null) => {
  switch (plan) {
    case "UNLIMITED":
      return ["PROGRAMMING", "JOBHUNTING"];
    case "COMMUNITY":
      return ["FREE"];
    default:
      return [plan ?? "FREE"];
  }
}

export const ALL_SKILLS = ["PHP", "C#", "React", "Java", "Python", "HTML", "CSS", "JavaScript"] as const;
type SkillTuple = [...(typeof ALL_SKILLS), {custom: string;}];
export type Skill = SkillTuple[number];

export const expToStr = (exp: number) => {
  switch (exp) {
    case 0:
      return "未経験";
    case 1:
      return "1~2年";
    case 3:
      return "3~5年";
    case 5:
      return "5~10年";
    case 11:
      return "11年以上";
    default:
      return "";
  }
}
