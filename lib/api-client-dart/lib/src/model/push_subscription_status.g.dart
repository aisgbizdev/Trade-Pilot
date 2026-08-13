// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_subscription_status.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PushSubscriptionStatus extends PushSubscriptionStatus {
  @override
  final bool subscribed;

  factory _$PushSubscriptionStatus(
          [void Function(PushSubscriptionStatusBuilder)? updates]) =>
      (PushSubscriptionStatusBuilder()..update(updates))._build();

  _$PushSubscriptionStatus._({required this.subscribed}) : super._();
  @override
  PushSubscriptionStatus rebuild(
          void Function(PushSubscriptionStatusBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushSubscriptionStatusBuilder toBuilder() =>
      PushSubscriptionStatusBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushSubscriptionStatus && subscribed == other.subscribed;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, subscribed.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushSubscriptionStatus')
          ..add('subscribed', subscribed))
        .toString();
  }
}

class PushSubscriptionStatusBuilder
    implements Builder<PushSubscriptionStatus, PushSubscriptionStatusBuilder> {
  _$PushSubscriptionStatus? _$v;

  bool? _subscribed;
  bool? get subscribed => _$this._subscribed;
  set subscribed(bool? subscribed) => _$this._subscribed = subscribed;

  PushSubscriptionStatusBuilder() {
    PushSubscriptionStatus._defaults(this);
  }

  PushSubscriptionStatusBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _subscribed = $v.subscribed;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushSubscriptionStatus other) {
    _$v = other as _$PushSubscriptionStatus;
  }

  @override
  void update(void Function(PushSubscriptionStatusBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushSubscriptionStatus build() => _build();

  _$PushSubscriptionStatus _build() {
    final _$result = _$v ??
        _$PushSubscriptionStatus._(
          subscribed: BuiltValueNullFieldError.checkNotNull(
              subscribed, r'PushSubscriptionStatus', 'subscribed'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
