// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tiktok_complete_signup_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TiktokCompleteSignupBody extends TiktokCompleteSignupBody {
  @override
  final String email;

  factory _$TiktokCompleteSignupBody(
          [void Function(TiktokCompleteSignupBodyBuilder)? updates]) =>
      (TiktokCompleteSignupBodyBuilder()..update(updates))._build();

  _$TiktokCompleteSignupBody._({required this.email}) : super._();
  @override
  TiktokCompleteSignupBody rebuild(
          void Function(TiktokCompleteSignupBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TiktokCompleteSignupBodyBuilder toBuilder() =>
      TiktokCompleteSignupBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TiktokCompleteSignupBody && email == other.email;
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
    return (newBuiltValueToStringHelper(r'TiktokCompleteSignupBody')
          ..add('email', email))
        .toString();
  }
}

class TiktokCompleteSignupBodyBuilder
    implements
        Builder<TiktokCompleteSignupBody, TiktokCompleteSignupBodyBuilder> {
  _$TiktokCompleteSignupBody? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  TiktokCompleteSignupBodyBuilder() {
    TiktokCompleteSignupBody._defaults(this);
  }

  TiktokCompleteSignupBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TiktokCompleteSignupBody other) {
    _$v = other as _$TiktokCompleteSignupBody;
  }

  @override
  void update(void Function(TiktokCompleteSignupBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TiktokCompleteSignupBody build() => _build();

  _$TiktokCompleteSignupBody _build() {
    final _$result = _$v ??
        _$TiktokCompleteSignupBody._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'TiktokCompleteSignupBody', 'email'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
