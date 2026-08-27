// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_feedback_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AdminFeedbackList extends AdminFeedbackList {
  @override
  final BuiltList<AdminFeedbackRow> feedback;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$AdminFeedbackList(
          [void Function(AdminFeedbackListBuilder)? updates]) =>
      (AdminFeedbackListBuilder()..update(updates))._build();

  _$AdminFeedbackList._(
      {required this.feedback,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  AdminFeedbackList rebuild(void Function(AdminFeedbackListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AdminFeedbackListBuilder toBuilder() =>
      AdminFeedbackListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminFeedbackList &&
        feedback == other.feedback &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, feedback.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AdminFeedbackList')
          ..add('feedback', feedback)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class AdminFeedbackListBuilder
    implements Builder<AdminFeedbackList, AdminFeedbackListBuilder> {
  _$AdminFeedbackList? _$v;

  ListBuilder<AdminFeedbackRow>? _feedback;
  ListBuilder<AdminFeedbackRow> get feedback =>
      _$this._feedback ??= ListBuilder<AdminFeedbackRow>();
  set feedback(ListBuilder<AdminFeedbackRow>? feedback) =>
      _$this._feedback = feedback;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _page;
  int? get page => _$this._page;
  set page(int? page) => _$this._page = page;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  AdminFeedbackListBuilder() {
    AdminFeedbackList._defaults(this);
  }

  AdminFeedbackListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _feedback = $v.feedback.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AdminFeedbackList other) {
    _$v = other as _$AdminFeedbackList;
  }

  @override
  void update(void Function(AdminFeedbackListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AdminFeedbackList build() => _build();

  _$AdminFeedbackList _build() {
    _$AdminFeedbackList _$result;
    try {
      _$result = _$v ??
          _$AdminFeedbackList._(
            feedback: feedback.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'AdminFeedbackList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'AdminFeedbackList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'AdminFeedbackList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'feedback';
        feedback.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AdminFeedbackList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
