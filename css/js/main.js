document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const successMsg = document.getElementById("form-success");
  
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  // ВСТАВЬ СВОИ ДАННЫЕ ИЗ TELEGRAM ЗДЕСЬ
  const BOT_TOKEN = "ТВОЙ_ТОКЕН_ОТ_BOTFATHER"; 
  const CHAT_ID = "ТВОЙ_CHAT_ID";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Собираем данные из полей
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();
    const phone = formData.get("phone")?.trim();
    const car = formData.get("car")?.trim() || "Не указано";
    const serviceSelect = form.querySelector('#service');
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const date = formData.get("date") || "Не указана";
    const message = formData.get("message")?.trim() || "Нет комментария";

    // Простая валидация обязательных полей
    if (!name || !phone) {
      alert("Пожалуйста, заполните обязательные поля: Имя и Телефон.");
      return;
    }

    // Формируем текст сообщения для Telegram (HTML разметка)
    const text = `
🔥 <b>Новая заявка с сайта Detail Studio!</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
🚘 <b>Авто:</b> ${car}

🛠 <b>Услуга:</b> ${service === 'Выберите услугу' ? 'Не выбрана' : service}
📅 <b>Желаемая дата:</b> ${date}

💬 <b>Комментарий:</b>
${message}
    `;

    try {
      // Состояние загрузки
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "Отправка...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      // Отправка запроса в Telegram API
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "HTML"
        })
      });

      if (response.ok) {
        // Успех
        form.reset();
        successMsg.hidden = false;
        submitBtn.textContent = "Заявка отправлена!";
        
        // Прячем сообщение об успехе через 6 секунд
        setTimeout(() => {
          successMsg.hidden = true;
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }, 6000);
      } else {
        throw new Error("Ошибка API Telegram");
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Произошла ошибка при отправке. Пожалуйста, напишите нам в мессенджер.");
      submitBtn.textContent = "Отправить заявку";
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }
  });
});