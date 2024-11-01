import React from 'react';
import { Form, Input, Button } from 'antd';
import styles from './LoginForm.module.css';
import { useDispatch } from 'react-redux';
import { setName } from '../../../../redux/slices/userSlice';

interface LoginFormProps {
  onSubmit: (name: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleFinish = (values: { name: string }) => {
    dispatch(setName(values.name));
    onSubmit(values.name);
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        className={styles.form}
        requiredMark={false}
      >
        <div className={styles.formItem}>
          <Form.Item
            label={
              <label className={styles.label}>
                Antes da sua jornada começar, informe seu nome abaixo:
              </label>}
            name="name"
            rules={[{ required: true, message: 'Por favor, digite seu nome!' }]}
          >
            <Input placeholder="Digite seu nome" className={styles.input} />
          </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
            Iniciar Jornada
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
