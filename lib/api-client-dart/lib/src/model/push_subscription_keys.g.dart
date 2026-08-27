// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_subscription_keys.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PushSubscriptionKeys extends PushSubscriptionKeys {
  @override
  final String p256dh;
  @override
  final String auth;

  factory _$PushSubscriptionKeys(
          [void Function(PushSubscriptionKeysBuilder)? updates]) =>
      (PushSubscriptionKeysBuilder()..update(updates))._build();

  _$PushSubscriptionKeys._({required this.p256dh, required this.auth})
      : super._();
  @override
  PushSubscriptionKeys rebuild(
          void Function(PushSubscriptionKeysBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushSubscriptionKeysBuilder toBuilder() =>
      PushSubscriptionKeysBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushSubscriptionKeys &&
        p256dh == other.p256dh &&
        auth == other.auth;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, p256dh.hashCode);
    _$hash = $jc(_$hash, auth.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushSubscriptionKeys')
          ..add('p256dh', p256dh)
          ..add('auth', auth))
        .toString();
  }
}

class PushSubscriptionKeysBuilder
    implements Builder<PushSubscriptionKeys, PushSubscriptionKeysBuilder> {
  _$PushSubscriptionKeys? _$v;

  String? _p256dh;
  String? get p256dh => _$this._p256dh;
  set p256dh(String? p256dh) => _$this._p256dh = p256dh;

  String? _auth;
  String? get auth => _$this._auth;
  set auth(String? auth) => _$this._auth = auth;

  PushSubscriptionKeysBuilder() {
    PushSubscriptionKeys._defaults(this);
  }

  PushSubscriptionKeysBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _p256dh = $v.p256dh;
      _auth = $v.auth;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushSubscriptionKeys other) {
    _$v = other as _$PushSubscriptionKeys;
  }

  @override
  void update(void Function(PushSubscriptionKeysBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushSubscriptionKeys build() => _build();

  _$PushSubscriptionKeys _build() {
    final _$result = _$v ??
        _$PushSubscriptionKeys._(
          p256dh: BuiltValueNullFieldError.checkNotNull(
              p256dh, r'PushSubscriptionKeys', 'p256dh'),
          auth: BuiltValueNullFieldError.checkNotNull(
              auth, r'PushSubscriptionKeys', 'auth'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
