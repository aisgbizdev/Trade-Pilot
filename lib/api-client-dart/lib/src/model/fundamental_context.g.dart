// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fundamental_context.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FundamentalContext extends FundamentalContext {
  @override
  final BuiltList<FundamentalNewsItem> newsItems;
  @override
  final BuiltList<FundamentalCalendarEvent> calendarEvents;

  factory _$FundamentalContext(
          [void Function(FundamentalContextBuilder)? updates]) =>
      (FundamentalContextBuilder()..update(updates))._build();

  _$FundamentalContext._(
      {required this.newsItems, required this.calendarEvents})
      : super._();
  @override
  FundamentalContext rebuild(
          void Function(FundamentalContextBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FundamentalContextBuilder toBuilder() =>
      FundamentalContextBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FundamentalContext &&
        newsItems == other.newsItems &&
        calendarEvents == other.calendarEvents;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, newsItems.hashCode);
    _$hash = $jc(_$hash, calendarEvents.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FundamentalContext')
          ..add('newsItems', newsItems)
          ..add('calendarEvents', calendarEvents))
        .toString();
  }
}

class FundamentalContextBuilder
    implements Builder<FundamentalContext, FundamentalContextBuilder> {
  _$FundamentalContext? _$v;

  ListBuilder<FundamentalNewsItem>? _newsItems;
  ListBuilder<FundamentalNewsItem> get newsItems =>
      _$this._newsItems ??= ListBuilder<FundamentalNewsItem>();
  set newsItems(ListBuilder<FundamentalNewsItem>? newsItems) =>
      _$this._newsItems = newsItems;

  ListBuilder<FundamentalCalendarEvent>? _calendarEvents;
  ListBuilder<FundamentalCalendarEvent> get calendarEvents =>
      _$this._calendarEvents ??= ListBuilder<FundamentalCalendarEvent>();
  set calendarEvents(ListBuilder<FundamentalCalendarEvent>? calendarEvents) =>
      _$this._calendarEvents = calendarEvents;

  FundamentalContextBuilder() {
    FundamentalContext._defaults(this);
  }

  FundamentalContextBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _newsItems = $v.newsItems.toBuilder();
      _calendarEvents = $v.calendarEvents.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FundamentalContext other) {
    _$v = other as _$FundamentalContext;
  }

  @override
  void update(void Function(FundamentalContextBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FundamentalContext build() => _build();

  _$FundamentalContext _build() {
    _$FundamentalContext _$result;
    try {
      _$result = _$v ??
          _$FundamentalContext._(
            newsItems: newsItems.build(),
            calendarEvents: calendarEvents.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'newsItems';
        newsItems.build();
        _$failedField = 'calendarEvents';
        calendarEvents.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FundamentalContext', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
