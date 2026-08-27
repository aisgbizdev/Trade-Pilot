// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'forgot_password_question_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ForgotPasswordQuestionBody extends ForgotPasswordQuestionBody {
  @override
  final String email;

  factory _$ForgotPasswordQuestionBody(
          [void Function(ForgotPasswordQuestionBodyBuilder)? updates]) =>
      (ForgotPasswordQuestionBodyBuilder()..update(updates))._build();

  _$ForgotPasswordQuestionBody._({required this.email}) : super._();
  @override
  ForgotPasswordQuestionBody rebuild(
          void Function(ForgotPasswordQuestionBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ForgotPasswordQuestionBodyBuilder toBuilder() =>
      ForgotPasswordQuestionBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ForgotPasswordQuestionBody && email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ForgotPasswordQuestionBody')
          ..add('email', email))
        .toString();
  }
}

class ForgotPasswordQuestionBodyBuilder
    implements
        Builder<ForgotPasswordQuestionBody, ForgotPasswordQuestionBodyBuilder> {
  _$ForgotPasswordQuestionBody? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  ForgotPasswordQuestionBodyBuilder() {
    ForgotPasswordQuestionBody._defaults(this);
  }

  ForgotPasswordQuestionBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ForgotPasswordQuestionBody other) {
    _$v = other as _$ForgotPasswordQuestionBody;
  }

  @override
  void update(void Function(ForgotPasswordQuestionBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ForgotPasswordQuestionBody build() => _build();

  _$ForgotPasswordQuestionBody _build() {
    final _$result = _$v ??
        _$ForgotPasswordQuestionBody._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'ForgotPasswordQuestionBody', 'email'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
