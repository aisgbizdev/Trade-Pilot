// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_security_answer_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VerifySecurityAnswerBody extends VerifySecurityAnswerBody {
  @override
  final String email;
  @override
  final String securityAnswer;

  factory _$VerifySecurityAnswerBody(
          [void Function(VerifySecurityAnswerBodyBuilder)? updates]) =>
      (VerifySecurityAnswerBodyBuilder()..update(updates))._build();

  _$VerifySecurityAnswerBody._(
      {required this.email, required this.securityAnswer})
      : super._();
  @override
  VerifySecurityAnswerBody rebuild(
          void Function(VerifySecurityAnswerBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VerifySecurityAnswerBodyBuilder toBuilder() =>
      VerifySecurityAnswerBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VerifySecurityAnswerBody &&
        email == other.email &&
        securityAnswer == other.securityAnswer;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, securityAnswer.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VerifySecurityAnswerBody')
          ..add('email', email)
          ..add('securityAnswer', securityAnswer))
        .toString();
  }
}

class VerifySecurityAnswerBodyBuilder
    implements
        Builder<VerifySecurityAnswerBody, VerifySecurityAnswerBodyBuilder> {
  _$VerifySecurityAnswerBody? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _securityAnswer;
  String? get securityAnswer => _$this._securityAnswer;
  set securityAnswer(String? securityAnswer) =>
      _$this._securityAnswer = securityAnswer;

  VerifySecurityAnswerBodyBuilder() {
    VerifySecurityAnswerBody._defaults(this);
  }

  VerifySecurityAnswerBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _securityAnswer = $v.securityAnswer;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VerifySecurityAnswerBody other) {
    _$v = other as _$VerifySecurityAnswerBody;
  }

  @override
  void update(void Function(VerifySecurityAnswerBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VerifySecurityAnswerBody build() => _build();

  _$VerifySecurityAnswerBody _build() {
    final _$result = _$v ??
        _$VerifySecurityAnswerBody._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'VerifySecurityAnswerBody', 'email'),
          securityAnswer: BuiltValueNullFieldError.checkNotNull(
              securityAnswer, r'VerifySecurityAnswerBody', 'securityAnswer'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
