// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notifications_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$NotificationsList extends NotificationsList {
  @override
  final BuiltList<Notification> notifications;
  @override
  final int unreadCount;

  factory _$NotificationsList(
          [void Function(NotificationsListBuilder)? updates]) =>
      (NotificationsListBuilder()..update(updates))._build();

  _$NotificationsList._(
      {required this.notifications, required this.unreadCount})
      : super._();
  @override
  NotificationsList rebuild(void Function(NotificationsListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  NotificationsListBuilder toBuilder() =>
      NotificationsListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is NotificationsList &&
        notifications == other.notifications &&
        unreadCount == other.unreadCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, notifications.hashCode);
    _$hash = $jc(_$hash, unreadCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'NotificationsList')
          ..add('notifications', notifications)
          ..add('unreadCount', unreadCount))
        .toString();
  }
}

class NotificationsListBuilder
    implements Builder<NotificationsList, NotificationsListBuilder> {
  _$NotificationsList? _$v;

  ListBuilder<Notification>? _notifications;
  ListBuilder<Notification> get notifications =>
      _$this._notifications ??= ListBuilder<Notification>();
  set notifications(ListBuilder<Notification>? notifications) =>
      _$this._notifications = notifications;

  int? _unreadCount;
  int? get unreadCount => _$this._unreadCount;
  set unreadCount(int? unreadCount) => _$this._unreadCount = unreadCount;

  NotificationsListBuilder() {
    NotificationsList._defaults(this);
  }

  NotificationsListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _notifications = $v.notifications.toBuilder();
      _unreadCount = $v.unreadCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(NotificationsList other) {
    _$v = other as _$NotificationsList;
  }

  @override
  void update(void Function(NotificationsListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  NotificationsList build() => _build();

  _$NotificationsList _build() {
    _$NotificationsList _$result;
    try {
      _$result = _$v ??
          _$NotificationsList._(
            notifications: notifications.build(),
            unreadCount: BuiltValueNullFieldError.checkNotNull(
                unreadCount, r'NotificationsList', 'unreadCount'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'notifications';
        notifications.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'NotificationsList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
