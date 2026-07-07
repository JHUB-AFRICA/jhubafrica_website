export default function ContactStrip() {
  return (
    <section className="contact-strip">
      <div className="contact-strip-inner">
        <div>
          <div className="contact-label">Host Institution</div>
          <h3>Jomo Kenyatta University of Agriculture and Technology</h3>
          <p>
            JKUAT Main Campus, Juja, Kenya. JHUB Africa is the innovation hub of
            JKUAT, supporting researchers, students and entrepreneurs.
          </p>
        </div>
        <div>
          <div className="contact-label">Call Us</div>
          <p>Tel: +254 67 52181/4</p>
          <p>LAN Ext: 2814</p>
        </div>
        <div>
          <div className="contact-label">Email</div>
          <p>
            <a href="mailto:info.jhub@jkuat.ac.ke">info.jhub@jkuat.ac.ke</a>
          </p>
        </div>
      </div>
    </section>
  );
}
