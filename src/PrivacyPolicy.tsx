import { MiscTemplate, FormItem, Paragraph, H1 } from './Parts';

const PrivacyPolicy = () => {
  return (
    <MiscTemplate title="プライバシーポリシー">
      <FormItem>
        <Paragraph>
          テキストテキスト
        </Paragraph>
      </FormItem>
      <FormItem>
        <H1>第1条（個人情報の定義）</H1>
        <Paragraph>
          テキストテキスト
        </Paragraph>
      </FormItem>
      <FormItem>
        <H1>第2条（個人情報の収集方法）</H1>
        <Paragraph>
          テキストテキスト
        </Paragraph>
      </FormItem>
    </MiscTemplate>
  );
}

export default PrivacyPolicy;
